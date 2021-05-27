import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { AnioLectivoService } from "@services/anio-lectivo/anio-lectivo.service";
import { FormInitService } from '@services/form-init/form-init.service';
import { IAnioLectivo, IEstadoAnioLectivo, IRango } from '@interfaces/all.interface';
import { compareFn, getCurrentYear } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-form-anio-lectivo',
	templateUrl: './form-anio-lectivo.component.html',
	styleUrls: ['./form-anio-lectivo.component.scss']
})
export class FormAnioLectivoComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    formAnioLectivo: FormGroup;
	createAnioLectivo: boolean;
	anioLectivo: IAnioLectivo;
	estadosAniosLectivos$: Observable<IEstadoAnioLectivo[]>;
	rangos$: Observable<IRango[]>;
	compareFn = compareFn;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private formInitService: FormInitService,
		private anioLectivoService: AnioLectivoService
	) { }

	ngOnInit(): void {
		this.formAnioLectivo = this.formInitService.getFormAnioLectivo();
		this.estadosAniosLectivos$ = this.apiAnioLectivoService.getEstadosAniosLectivos();
		this.rangos$ = this.apiAnioLectivoService.getRangos();

		this.anioLectivoService.anioLectivo$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((anioLectivo: IAnioLectivo) => {
			if (!anioLectivo) return this.resetFormAnioLectivo();
			this.anioLectivo = anioLectivo;
		});
		this.anioLectivoService.shouldCreate$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((state: boolean) => {
			this.createAnioLectivo = state;
			if (!state) {
				this.setAnioLectivo(this.anioLectivo);
			}
		});
	}

	ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	getAnioLectivo(): IAnioLectivo {
		return {
			anio_actual: this.anio_actual.value,
			descripcion: this.descripcion.value,
			estado_anio_lectivo: this.estado_anio_lectivo.value,
			rango: this.rango.value,
			vigente: this.vigente.value,

			id_estado_anio_lectivo: this.estado_anio_lectivo.value.id,
			id_rango: this.rango.value.id
		};
	}

	setAnioLectivo(anioLectivo: IAnioLectivo): void {
		const { anio_actual, descripcion, estado_anio_lectivo, rango, vigente } = anioLectivo;
		this.anio_actual.setValue(anio_actual);
		this.descripcion.setValue(descripcion);
		this.estado_anio_lectivo.setValue(estado_anio_lectivo);
		this.rango.setValue(rango);
		this.vigente.setValue(vigente);
	}

	sendFormAnioLectivo(): void {
		if (this.formAnioLectivo.invalid) return;

		if (this.createAnioLectivo) {
			PopUp.question('Esta seguro/a?', 'Creara un nuevo año lectivo.')
			.then((result: SweetAlertResult) => {
				if (result.value) {
					this.anioLectivoService.createAnioLectivo(this.getAnioLectivo())
					.pipe(takeUntil(this.unsubscribe))
					.subscribe((created: boolean) => this.resetFormAnioLectivo());
				}
			});
			return;
		}

		PopUp.question('Esta seguro/a?', 'Editara el año lectivo actual.')
		.then((result: SweetAlertResult) => {
			if (result.value) {
				this.anioLectivoService.updateAnioLectivo(this.getAnioLectivo())
				.pipe(takeUntil(this.unsubscribe))
				.subscribe((data: any) => this.resetFormAnioLectivo());
			}
		});
	}

	resetFormAnioLectivo(): void {
		this.formAnioLectivo.reset();
		this.anio_actual.setValue(getCurrentYear());
		this.vigente.setValue(true);
	}

	get anio_actual() { return this.formAnioLectivo.get('anio_actual'); }
	get descripcion() { return this.formAnioLectivo.get('descripcion'); }
	get estado_anio_lectivo() { return this.formAnioLectivo.get('estado_anio_lectivo'); }
	get rango() { return this.formAnioLectivo.get('rango'); }
	get vigente() { return this.formAnioLectivo.get('vigente'); }

}