import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { AreaService } from '@services/area/area.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { IArea } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-form-area',
	templateUrl: './form-area.component.html',
	styleUrls: ['./form-area.component.scss']
})
export class FormAreaComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    formArea: FormGroup;
	createArea: boolean;
	area: IArea;
	compareFn = compareFn;
	
	constructor(
		public areaService: AreaService,
		private formInitService: FormInitService
	) { }

	ngOnInit(): void {
		this.formArea = this.formInitService.getFormArea();
		
		this.areaService.area$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((area: IArea) => {
			if (!area) return this.resetFormArea();
			this.area = area;
		});
		this.areaService.shouldCreate$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((state: boolean) => {
			this.createArea = state;
			if (!state) {
				this.setArea(this.area);
			}
		});
	}

	ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	getArea(): IArea {
		return {
			nombre: this.nombre.value,
			descripcion: this.descripcion.value
		};
	}

	setArea(area: IArea): void {
		const { nombre, descripcion } = area;
		this.nombre.setValue(nombre);
		this.descripcion.setValue(descripcion);
	}

	sendFormArea(): void {
		if (this.formArea.invalid) return;

		if (this.createArea) {
			PopUp.question('Esta seguro/a?', 'Creara una nueva área.')
			.then((result: SweetAlertResult) => {
				if (result.value) {
					this.areaService.createArea(this.getArea())
					.pipe(takeUntil(this.unsubscribe))
					.subscribe((created: boolean) => this.resetFormArea());
				}
			});
			return;
		}

		PopUp.question('Esta seguro/a?', 'Editara el área actual.')
		.then((result: SweetAlertResult) => {
			if (result.value) {
				this.areaService.updateArea(this.getArea())
				.pipe(takeUntil(this.unsubscribe))
				.subscribe((area: IArea) => this.resetFormArea());
			}
		});
	}

	resetFormArea(): void {
		this.formArea.reset();
	}

	get nombre() { return this.formArea.get('nombre'); }
	get descripcion() { return this.formArea.get('descripcion'); }

}