import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ActividadService } from '@services/actividad/actividad.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { IActividad } from '@interfaces/all.interface';

@Component({
	selector: 'app-form-actividad',
	templateUrl: './form-actividad.component.html',
	styleUrls: ['./form-actividad.component.scss']
})
export class FormActividadComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    formActividad: FormGroup;
    createActividad: boolean;
    message: string = '';
	actividad: IActividad;
    disabledButton: boolean = false;
	
	constructor(
		private formInitService: FormInitService,
		public actividadService: ActividadService
	) { }

	ngOnInit(): void {
		this.formActividad = this.formInitService.getFormActividad();

		this.actividadService.actividad$.pipe(takeUntil(this.unsubscribe))
        .subscribe((actividad: IActividad) => {
            if (!actividad) return;
            this.actividad = actividad;
            this.setActividad(actividad);
        });

        this.actividadService.shouldCreate$.pipe(takeUntil(this.unsubscribe))
        .subscribe((state: boolean) => {
            this.createActividad = state;
        });
	}

	ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}
	
	getActividad(): IActividad {
        const actividad: IActividad = {};
        actividad.nombre = this.formActividad.get('nombre').value;
        actividad.descripcion = this.formActividad.get('descripcion').value;
        actividad.porcentaje = this.formActividad.get('porcentaje').value;
        actividad.id_logro = this.actividadService.selectedLogro.id;
        return actividad;
    }

    setActividad(actividad: IActividad) {
        this.formActividad.get('nombre').setValue(actividad.nombre);
        this.formActividad.get('descripcion').setValue(actividad.descripcion);
        this.formActividad.get('porcentaje').setValue(actividad.porcentaje);
	}

	addActividad(): void {
        this.message = '';
        const actividad = this.getActividad();
        const tempPorcentaje = (this.createActividad) ?
        this.actividadService.addPorcentaje(actividad) :
        this.actividadService.subtractPorcentaje(this.actividad) + +actividad.porcentaje;
        
        if (tempPorcentaje > 100) {
            this.message = 'La actividad no se puede agregar excede el 100%';
            return console.log('La actividad no se puede agregar excede el 100%');
        }

        if (this.createActividad) {
            this.actividadService.addActividad(actividad);
        } else {
            this.actividadService.editActividad({ ...this.actividad, ...actividad });
        }
        this.resetFormActividad();
    }
	
	sendFormActividad(): void {
        this.disabledButton = true;
        if (this.actividadService.create) 
            this.actividadService.createActividades()
            .pipe(take(1))
            .subscribe((estado: boolean) => {
                if (estado) {
                    this.disabledButton = false;
                }
            });
        else
            this.actividadService.updateActividades()
            .pipe(take(1))
            .subscribe((estado: boolean) => {
                if (estado) {
                    this.disabledButton = false;
                }
            });
    }

    resetFormActividad(): void {
        this.formActividad.reset();
    }
    
    get porcentaje() {
        return this.formActividad.get('porcentaje');
    }

}