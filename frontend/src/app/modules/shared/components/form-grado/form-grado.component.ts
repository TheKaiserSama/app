import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { FormInitService } from '@services/form-init/form-init.service';
import { GradoService } from "@services/grado/grado.service";
import { IGrado } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-form-grado',
	templateUrl: './form-grado.component.html',
	styleUrls: ['./form-grado.component.scss']
})
export class FormGradoComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    formGrado: FormGroup;
	createGrado: boolean;
	grado: IGrado;
	compareFn = compareFn;
	
	constructor(
		private formInitService: FormInitService,
		public gradoService: GradoService
	) { }

	ngOnInit(): void {
		this.formGrado = this.formInitService.getFormGrado();

		this.gradoService.grado$.
		pipe(takeUntil(this.unsubscribe))
		.subscribe((grado: IGrado) => {
			if (!grado) return this.resetFormGrado();
			this.grado = grado;
		});
		this.gradoService.shouldCreate$.
		pipe(takeUntil(this.unsubscribe)).
		subscribe((state: boolean) => {
			this.createGrado = state;
			if (!state) {
				this.setGrado(this.grado);
			}
		});
	}

	ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	getGrado(): IGrado {
		const grado: IGrado = {
			grado: this.descripcion.value
		};
		return grado;
	}

	setGrado(_grado: IGrado) {
		const { grado } = _grado;
		this.descripcion.setValue(grado);
	}

	sendFormGrado() {
		if (this.formGrado.invalid) return;

		if (this.createGrado) {
			PopUp.question('Esta seguro/a?', 'Creara un nuevo grado.').
			then((result: SweetAlertResult) => {
				if (result.value) {
					this.gradoService.createGrado(this.getGrado()).
					pipe(takeUntil(this.unsubscribe)).
					subscribe((created: boolean) => this.resetFormGrado());
				}
			});
			return;
		}

		PopUp.question('Esta seguro/a?', 'Editara el grado actual.').
		then((result: SweetAlertResult) => {
			if (result.value) {
				this.gradoService.updateGrado(this.getGrado()).
				pipe(takeUntil(this.unsubscribe)).
				subscribe((data: any) => this.resetFormGrado());
			}
		});
	}

	resetFormGrado(): void {
		this.formGrado.reset();
	}

	get descripcion() { return this.formGrado.get('descripcion'); }

}