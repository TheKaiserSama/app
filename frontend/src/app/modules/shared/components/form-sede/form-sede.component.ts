import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiInstitucionService } from '@api/api-institucion.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { SedeService } from '@services/sede/sede.service';
import { IInstitucion, ISede } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-form-sede',
	templateUrl: './form-sede.component.html',
	styleUrls: ['./form-sede.component.scss']
})
export class FormSedeComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    formSede: FormGroup;
	createSede: boolean;
	institucion$: Observable<IInstitucion>;
	_institucion: IInstitucion;
	sede: ISede;
	compareFn = compareFn;

	constructor(
		private apiInstitucionService: ApiInstitucionService,
		private formInitService: FormInitService,
		private sedeService: SedeService
	) { }

	ngOnInit(): void {
		this.formSede = this.formInitService.getFormSede();
		
		this.institucion$ = this.apiInstitucionService.getInstituciones().pipe(
			map((instituciones: IInstitucion[]) => {
				if (instituciones && instituciones.length > 0) {
					this._institucion = instituciones[0];
					this.institucion.setValue(instituciones[0]);
					return instituciones[0];
				} else
					return {};
			})
		);

		this.sedeService.sede$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((sede: ISede) => {
			if (!sede) return this.resetFormSede();
			this.sede = sede;
		});
		
		this.sedeService.createSede$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((state: boolean) => {
			this.createSede = state;
			if (!state) {
				this.setSede(this.sede);
			}
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getSede(): ISede {
		return {
			nombre: this.nombre.value,
			descripcion: this.descripcion.value,
			direccion: this.direccion.value,
			telefono: this.telefono.value,
			id_institucion: this.institucion.value.id,
			institucion: this.institucion.value,
		};
	}

	setSede(sede: ISede): void {
		const { nombre, descripcion, direccion, telefono, institucion } = sede;
		this.nombre.setValue(nombre);
		this.descripcion.setValue(descripcion);
		this.direccion.setValue(direccion);
		this.telefono.setValue(telefono);
		this.institucion.setValue(institucion);
	}

	sendFormSede(): void {
		if (this.formSede.invalid) return;

		if (this.createSede) {
			PopUp.question('Esta seguro/a?', 'Creara una nueva sede.')
			.then((result: SweetAlertResult) => {
				if (result.value) {
					this.sedeService.createSede(this.getSede())
					.pipe(takeUntil(this.unsubscribe))
					.subscribe((created: boolean) => this.resetFormSede());
				}
			});
			return;
		}

		PopUp.question('Esta seguro/a?', 'Editara la sede actual.')
		.then((result: SweetAlertResult) => {
			if (result.value) {
				this.sedeService.updateSede(this.getSede())
				.pipe(takeUntil(this.unsubscribe))
				.subscribe((data: any) => this.resetFormSede());
			}
		});
	}

	resetFormSede(): void {
		this.formSede.reset();
		this.institucion.setValue(this._institucion);
	}

	get nombre() { return this.formSede.get('nombre'); }
	get descripcion() { return this.formSede.get('descripcion'); }
	get direccion() { return this.formSede.get('direccion'); }
	get telefono() { return this.formSede.get('telefono'); }
	get institucion() { return this.formSede.get('institucion'); }

}