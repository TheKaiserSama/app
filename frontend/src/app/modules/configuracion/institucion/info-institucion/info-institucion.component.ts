import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { FormInitService } from '@services/form-init/form-init.service';
import { InstitucionService } from '@services/institucion/institucion.service';
import { SedeService } from '@services/sede/sede.service';
import { IInstitucion } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-info-institucion',
	templateUrl: './info-institucion.component.html',
	styleUrls: ['./info-institucion.component.scss']
})
export class InfoInstitucionComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	institucion$: Observable<IInstitucion> = this.institucionService.institucion$;
	formInstitucion: FormGroup;
	institucion: IInstitucion;
	tabActive = 1;

	constructor(
		private formInitService: FormInitService,
		private institucionService: InstitucionService,
		private modalService: NgbModal,
		private sedeService: SedeService
	) { }

	ngOnInit(): void {
		this.formInstitucion = this.formInitService.getFormInstitucion();
		this.institucionService.getInstituciones();

		this.institucion$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((institucion: IInstitucion) => {
			if (!institucion) return this.resetFormInstitucion();
			this.institucion = institucion;
			this.setInstitucion(institucion);
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getInstitucion(): IInstitucion {
		return {
			nombre: this.nombre.value,
			descripcion: this.descripcion.value,
			mision: this.mision.value,
			vision: this.vision.value,
			himno: this.himno.value,
			lema: this.lema.value
		}
	}

	setInstitucion(institucion: IInstitucion): void {
		const { nombre, descripcion, mision, vision, himno, lema } = institucion;
		this.nombre.setValue(nombre);
		this.descripcion.setValue(descripcion);
		this.mision.setValue(mision);
		this.vision.setValue(vision);
		this.himno.setValue(himno);
		this.lema.setValue(lema);
	}

	submitForm(): void {
		if (this.formInstitucion.invalid) {
			PopUp.info('Campo requerido', 'El nombre de la institución es requerido.');
			return;
		}

		if (!this.institucion) {
			this.institucionService.createInstitucion(this.getInstitucion());
		} else {
			this.institucionService.updateInstitucion(this.institucion.id, this.getInstitucion());
		}
	}

	resetFormInstitucion(): void {
		this.formInstitucion.reset();
	}

	openModalValoracionFormativa(content: any): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			windowClass: 'modal-valoracion-formativa',
		};
		this.modalService.open(content, modalOptions).result
		.then((result: any) => {}, (reason: any) => {});
	}

	openModalSede(content: any): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			windowClass: 'modal-1200px',
		};
		this.modalService.open(content, modalOptions).result
		.then((result: any) => {}, (reason: any) => {
			this.sedeService.initStateSede();
		});
	}

	get nombre() { return this.formInstitucion.get('nombre'); };
	get descripcion() { return this.formInstitucion.get('descripcion'); };
	get mision() { return this.formInstitucion.get('mision'); };
	get vision() { return this.formInstitucion.get('vision'); };
	get himno() { return this.formInstitucion.get('himno'); };
	get lema() { return this.formInstitucion.get('lema'); };

}