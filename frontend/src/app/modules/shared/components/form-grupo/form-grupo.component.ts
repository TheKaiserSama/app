import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { FormInitService } from '@services/form-init/form-init.service';
import { GrupoService } from '@services/grupo/grupo.service';
import { IGrupo } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-form-grupo',
	templateUrl: './form-grupo.component.html',
	styleUrls: ['./form-grupo.component.scss']
})
export class FormGrupoComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    formGrupo: FormGroup;
	createGrupo: boolean;
	grupo: IGrupo;
	compareFn = compareFn;
	
	constructor(
		private formInitService: FormInitService,
		private grupoService: GrupoService
	) { }
	
	ngOnInit(): void {
		this.formGrupo = this.formInitService.getFormGrupo();
		this.grupoService.grupo$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((grupo: IGrupo) => {
			if (!grupo) return this.resetFormGrupo();
			this.grupo = grupo;
		});
		this.grupoService.shouldCreate$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((state: boolean) => {
			this.createGrupo = state;
			if (!state) {
				this.setGrupo(this.grupo);
			}
		});
	}

	ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	getGrupo(): IGrupo {
		return {
			descripcion: this.descripcion.value.toString(),
			vigente: this.vigente.value
		};
	}

	setGrupo(grupo: IGrupo): void {
		const { descripcion, vigente } = grupo;
		this.descripcion.setValue(descripcion);
		this.vigente.setValue(vigente);
	}

	sendFormGrupo(): void {
		if (this.formGrupo.invalid) return;

		if (this.createGrupo) {
			PopUp.question('Esta seguro/a?', 'Creara un nuevo grupo.')
			.then((result: SweetAlertResult) => {
				if (result.value) {
					this.grupoService.createGrupo(this.getGrupo())
					.pipe(takeUntil(this.unsubscribe))
					.subscribe((created: boolean) => this.resetFormGrupo());
				}
			});
			return;
		}

		PopUp.question('Esta seguro/a?', 'Editara el grupo actual.')
		.then((result: SweetAlertResult) => {
			if (result.value) {
				this.grupoService.updateGrupo(this.getGrupo())
				.pipe(takeUntil(this.unsubscribe))
				.subscribe((data: any) => this.resetFormGrupo());
			}
		});
	}

	resetFormGrupo(): void {
		this.formGrupo.reset();
		this.vigente.setValue(true);
	}

	get descripcion() { return this.formGrupo.get('descripcion'); }
	get vigente() { return this.formGrupo.get('vigente'); }

}