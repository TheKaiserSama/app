import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { concatMap, map, takeUntil } from 'rxjs/operators';

import { FormPersonaComponent } from '@modules/personal/shared/components/form-persona/form-persona.component';
import { ApiOtrosService } from '@api/api-otros.service';
import { PersonaService } from '@services/persona/persona.service';
import { IPersona, IRol, IUsuario } from '@interfaces/all.interface';
import { ROL } from '@shared/const';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-info-persona',
	templateUrl: './info-persona.component.html',
	styleUrls: ['./info-persona.component.scss']
})
export class InfoPersonaComponent implements OnInit, OnDestroy {

	@ViewChild(FormPersonaComponent) formPersona: FormPersonaComponent;
	private unsubscribe = new Subject();
	roles$: Observable<IRol[]>;
	button = { show: false };
	statusForm: boolean = true;
	usuario: IUsuario;
	createPersona: boolean;

	constructor(
		private apiOtrosService: ApiOtrosService,
		public personaService: PersonaService,
	) { }

	ngOnInit(): void {
		setTimeout(() => {
            this.personaService.persona$
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((persona: IPersona) => {
				if (persona) this.formPersona.setPersona(persona);
			});

			this.personaService.shouldCreate$.pipe(
				concatMap((state: boolean) => {
					this.createPersona = state;
					if (state) return of(null);
					return this.personaService.persona$;
				}),
				takeUntil(this.unsubscribe)
			).subscribe((persona: IPersona) => {
				const arrayRol = (!persona) ? [ROL.ADMINISTRADOR.nombre, ROL.OTRO.nombre] : [persona.rol.nombre];
				this.roles$ = this.apiOtrosService.getRoles(arrayRol).pipe(
					map((roles: IRol[]) => {
						if (roles.length == 0) return;
						this.formPersona.controls['rol'].setValue(roles[0]);
						return roles;
					})
				);
			});

			this.personaService.usuario$
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((usuario: IUsuario) => {
				if (usuario) this.usuario = usuario;
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

	handleRol(rol: IRol): void {
		if (!rol) return;
		this.personaService.rol = rol;
	}

	handleChangeTab(): void {
		const documento = this.formPersona.documento.value;
		const personaForm = this.formPersona.getPersona();

		this.personaService.getPersonaPorDocumento(documento)
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((persona: IPersona) => {
			if (persona) {
				PopUp.info('Documento duplicado', `Ya existe una persona con el número de documento = ${ documento }.`);
			} else {
				if (this.createPersona) {
					if (personaForm.rol.nombre.toLowerCase() == 'otro') {
						this.personaService.createPersona(personaForm);
					} else {
						this.personaService.setPersona(personaForm);
						this.personaService.setTabActive(2);
						if (!this.usuario) {
							const { documento } = personaForm;
							this.personaService.setUsuario({ username: documento, password: documento.slice(-4) });
						}
					}
				} else {
					this.personaService.updatePersona(personaForm);
				}
			}
		});
	}

	resetFormPersona(): void {
		this.formPersona.resetFormPersona();
		this.personaService.setPersona(null);
	}

}