import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { IPeriodo, IAnioLectivo } from '@interfaces/all.interface';
import { compareFn, ngbDateToString, stringToNgbDateStruct } from '@shared/helpers/transform';

@Component({
	selector: 'app-form-periodo',
	templateUrl: './form-periodo.component.html',
	styleUrls: ['./form-periodo.component.scss']
})
export class FormPeriodoComponent implements OnInit {

	@Input() estilosBoton: any;
	@Output() emitPeriodo = new EventEmitter<IPeriodo>();
	aniosLectivos$: Observable<IAnioLectivo[]>;
    formPeriodo: FormGroup;	
	compareFn = compareFn;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private formInitService: FormInitService
	) { }

	ngOnInit(): void {
		this.formPeriodo = this.formInitService.getFormPeriodo();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });

	}

	getPeriodo(): IPeriodo {
		const fechaInicio = ngbDateToString(this.fecha_inicio.value);
		const fechaFinalizacion = ngbDateToString(this.fecha_finalizacion.value);
		const periodo: IPeriodo = {
			fecha_inicio: fechaInicio,
			fecha_finalizacion: fechaFinalizacion,
			numero: this.numero.value,
			descripcion: this.descripcion.value,
			anio_lectivo: this.anio_lectivo.value,

			id_anio_lectivo: this.anio_lectivo.value.id
		};
		return periodo;
	}

	setPeriodo(periodo: IPeriodo) {
		const { fecha_inicio, fecha_finalizacion, numero, descripcion, anio_lectivo } = periodo;
		const fechaInicio = stringToNgbDateStruct(fecha_inicio);
		const fechaFinalizacion = stringToNgbDateStruct(fecha_finalizacion);
		this.fecha_inicio.setValue(fechaInicio);
		this.fecha_finalizacion.setValue(fechaFinalizacion);
		this.numero.setValue(numero);
		this.descripcion.setValue(descripcion);
		this.anio_lectivo.setValue(anio_lectivo);
	}

	sendFormPeriodo(): void {
		if (this.formPeriodo.invalid) {
			console.log('Formulario invalido');
			return;
		}
		this.emitPeriodo.emit(this.getPeriodo());
	}

	onDateSelect(date: any): void { }

	resetFormPeriodo(): void {
		this.formPeriodo.reset();
	}

	get fecha_inicio() { return this.formPeriodo.get('fecha_inicio') };
	get fecha_finalizacion() { return this.formPeriodo.get('fecha_finalizacion') };
	get numero() { return this.formPeriodo.get('numero') };
	get descripcion() { return this.formPeriodo.get('descripcion') };
	get anio_lectivo() { return this.formPeriodo.get('anio_lectivo') };

}