import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';

import { FormInitService } from '@services/form-init/form-init.service';
import { ValoracionFormativaService } from '@services/valoracion-formativa/valoracion-formativa.service';
import { IValoracionFormativa } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-form-valoracion-formativa',
	templateUrl: './form-valoracion-formativa.component.html',
	styleUrls: ['./form-valoracion-formativa.component.scss']
})
export class FormValoracionFormativaComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	formValoracionFormativa: FormGroup;
	shouldCreate: boolean;
	valoracionFormativa: IValoracionFormativa;
	compareFn = compareFn;
	
	constructor(
		private formInitService: FormInitService,
		private valoracionFormativaService: ValoracionFormativaService,
	) { }

	ngOnInit(): void {
		this.formValoracionFormativa = this.formInitService.getFormValoracionFormativa();

		this.valoracionFormativaService.valoracionFormativa$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((valoracionFormativa: IValoracionFormativa) => {
			if (!valoracionFormativa) return this.resetFormValoracionFormativa();
			this.valoracionFormativa = valoracionFormativa;
		});

		this.valoracionFormativaService.shouldCreate$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((shouldCreate: boolean) => {
			this.shouldCreate = shouldCreate;
			if (!shouldCreate)
				this.setValoracionFormativa(this.valoracionFormativa);
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	sendFormValoracionFormativa(): void {
		if (this.formValoracionFormativa.invalid) return;

		if (this.shouldCreate)
			PopUp.question('Esta seguro/a?', 'Creara una nueva valoración formativa.')
			.then((result: SweetAlertResult) => {
				if (!result.value) return;
				this.valoracionFormativaService.createValoracionFormativa(this.getValoracionFormativa())
				.pipe(take(1))
				.subscribe((created: boolean) => this.resetFormValoracionFormativa());
			});
		else
			PopUp.question('Esta seguro/a?', 'Editara la valoración formativa actual.')
			.then((result: SweetAlertResult) => {
				if (!result.value) return;
				const { id } = this.valoracionFormativa;
				this.valoracionFormativaService.updateValoracionFormativa(id, this.getValoracionFormativa())
				.pipe(take(1))
				.subscribe((updated: boolean) => this.resetFormValoracionFormativa());
			});
	}

	getValoracionFormativa(): IValoracionFormativa {
		return {
			descripcion: this.descripcion.value.toString(),
			vigente: this.vigente.value
		};
	}

	setValoracionFormativa({ descripcion, vigente }: IValoracionFormativa) {
		this.descripcion.setValue(descripcion);
		this.vigente.setValue(vigente);
	}

	resetFormValoracionFormativa(): void {
		this.formValoracionFormativa.reset();
		this.vigente.setValue(true);
	}

	get descripcion() { return this.formValoracionFormativa.get('descripcion'); }
	get vigente() { return this.formValoracionFormativa.get('vigente'); }

}
