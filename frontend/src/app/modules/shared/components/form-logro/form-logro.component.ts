import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { FormInitService } from '@services/form-init/form-init.service';
import { LogroService } from '@services/logro/logro.service';
import { ILogro } from '@interfaces/all.interface';

@Component({
	selector: 'app-form-logro',
	templateUrl: './form-logro.component.html',
	styleUrls: ['./form-logro.component.scss']
})
export class FormLogroComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();
    formLogro: FormGroup;
    createLogro: boolean;
    message: string = '';
    logro: ILogro;
    disabledButton: boolean = false;

	constructor(
        private formInitService: FormInitService,
        public logroService: LogroService
    ) { }

	ngOnInit(): void {
        this.formLogro = this.formInitService.getFormLogro();
        
        this.logroService.logro$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((logro: ILogro) => {
            if (!logro) return this.resetFormLogro();
            this.logro = logro;
            this.setLogro(logro);
        });

        this.logroService.shouldCreate$
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((state: boolean) => {
            this.createLogro = state;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    getLogro(): ILogro {
        const logro: ILogro = {};
        logro.descripcion = this.formLogro.get('descripcion').value;
        logro.porcentaje = this.formLogro.get('porcentaje').value;
        logro.id_plan_docente = this.logroService.selectedCarAcad.id;
        return logro;
    }

    setLogro(logro: ILogro) {
        this.formLogro.get('descripcion').setValue(logro.descripcion);
        this.formLogro.get('porcentaje').setValue(logro.porcentaje);
    }

    addLogro(): void {
        this.message = '';
        const logro = this.getLogro();
        const tempPorcentaje = (this.createLogro)
        ? this.logroService.addPorcentaje(logro)
        : this.logroService.subtractPorcentaje(this.logro) + +logro.porcentaje;
        
        if (tempPorcentaje > 100) {
            this.message = 'El logro no se puede agregar excede el 100%';
            return console.log('El logro no se puede agregar excede el 100%');
        }

        if (this.createLogro) {
            this.logroService.addLogro(logro);
        } else {
            this.logroService.editLogro({ ...this.logro, ...logro });
        }
        this.resetFormLogro();
    }

    sendFormLogro(): void {
        this.disabledButton = true;
        if (this.logroService.create) {
            this.logroService.createLogros()
            .pipe(take(1))
            .subscribe((estado: boolean) => {
                if (estado) {
                    this.disabledButton = false;
                }
            });
        } else {
            this.logroService.updateLogros()
            .pipe(take(1))
            .subscribe((estado: boolean) => {
                if (estado) {
                    this.disabledButton = false;
                }
            });
        }
    }

    resetFormLogro(): void {
        this.formLogro.reset();
    }
    
    get porcentaje() {
        return this.formLogro.get('porcentaje');
    }

}