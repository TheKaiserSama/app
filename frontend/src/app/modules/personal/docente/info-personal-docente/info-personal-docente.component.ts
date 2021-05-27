import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, map, concatMap, take } from 'rxjs/operators';

import { FormPersonaComponent } from '@modules/personal/shared/components/form-persona/form-persona.component';
import { ApiPersonaService } from '@api/api-persona.service';
import { ApiOtrosService } from '@api/api-otros.service';
import { DocenteService } from '@services/docente/docente.service';
import { IPersona, IRol } from '@interfaces/all.interface';
import { ROL } from '@shared/const';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-info-personal-docente',
	templateUrl: './info-personal-docente.component.html',
	styleUrls: ['./info-personal-docente.component.scss']
})
export class InfoPersonalDocenteComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();
    @ViewChild(FormPersonaComponent) formPersona: FormPersonaComponent;
    roles$: Observable<IRol[]>;
	button = { show: false };
	statusForm: boolean = true;

	constructor(
		private apiPersonaService: ApiPersonaService,
		private apiOtrosService: ApiOtrosService,
		public docenteService: DocenteService,
	) { }

	ngOnInit(): void {
		setTimeout(() => {
            this.docenteService.infoPersonaDocente$
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((docente: IPersona) => {
                const idRol = (!docente) ? ROL.DOCENTE.nombre : docente.rol.nombre;
                this.roles$ = this.apiOtrosService.getRoles([idRol]).pipe(
					map((roles: IRol[]) => {
						this.formPersona.controls['rol'].setValue(roles[0]);
						return roles;
					})
				);
				if (docente) this.formPersona.setPersona(docente);
			});
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	handleStatusForm(value: boolean): void {
		this.statusForm = value;
	}

	handleChangeTab(): void {
		const documento = this.formPersona.documento.value;
		const personaForm = this.formPersona.getPersona();

		this.docenteService.shouldCreate$.pipe(
			take(1),
			concatMap((state: boolean) => {
				if (state) {
					return this.apiPersonaService.getPersonaPorNumeroDocumento(documento);
				}
				this.docenteService.setInfoPersonaDocente(personaForm);
				this.docenteService.setTabActive(2);
				return of(null);
			}),
			takeUntil(this.unsubscribe)
		).subscribe((persona: IPersona) => {
			if (persona) {
				PopUp.info('Documento duplicado', `Ya existe una persona con el número de documento '${ documento }'.`);
			} else {
				this.docenteService.setInfoPersonaDocente(personaForm);
				this.docenteService.setTabActive(2);
			}
		});
	}

	resetFormPersona(): void {
		this.formPersona.resetFormPersona();
		this.docenteService.setInfoPersonaDocente(null);
	}

}