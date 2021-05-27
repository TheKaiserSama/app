import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, take } from 'rxjs/operators';

import { ApiPersonaService } from '@api/api-persona.service';
import { ApiOtrosService } from '@api/api-otros.service';
import { FormPersonaComponent } from '@modules/personal/shared/components/form-persona/form-persona.component';
import { MatriculaService } from '@services/matricula/matricula.service';
import { IPersona, IRol } from '@interfaces/all.interface';
import { ROL } from '@shared/const';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-info-estudiante',
	templateUrl: './info-estudiante.component.html',
	styleUrls: ['./info-estudiante.component.scss']
})
export class InfoEstudianteComponent implements OnInit, OnDestroy {

	@ViewChild(FormPersonaComponent) formPersona: FormPersonaComponent;
    private unsubscribe = new Subject();
    roles$: Observable<IRol[]>;
	button = { show: false };
	statusForm: boolean = true;

	constructor(
		private apiPersonaService: ApiPersonaService,
		private apiOtrosService: ApiOtrosService,
		public matriculaService: MatriculaService,
	) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.matriculaService.shouldCreate$
			.pipe(take(1))
			.subscribe((state: boolean) => {
				if (!state) this.formPersona.documento.disable();
			});
			
            this.matriculaService.estudiante$
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((estudiante: IPersona) => {
				const idRol = (!estudiante) ? ROL.ESTUDIANTE.nombre : estudiante.rol.nombre;
				this.roles$ = this.apiOtrosService.getRoles([idRol]).pipe(
					map((roles: IRol[]) => {
						this.formPersona.controls['rol'].disable();
						this.formPersona.controls['rol'].setValue(roles[0]);
						return roles;
					})
				);
				if (estudiante) this.formPersona.setPersona(estudiante);
				if (!estudiante) this.formPersona.resetFormPersona();
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

	handleNumeroDocumento(numeroDocumento: string): void {
		this.matriculaService.getPersonaMatricula(numeroDocumento);
	}

	handleChangeTab(): void {
		const documento = this.formPersona.documento.value;
		const personaForm = this.formPersona.getPersona();

		this.matriculaService.shouldCreate$
		.pipe(take(1))
		.subscribe((status: boolean) => {
			if (!status) this.matriculaService.estudianteExiste = true;

			if (this.matriculaService.estudianteExiste) {
				this.matriculaService.setEstudiante(personaForm);
				this.matriculaService.setTabActive(2);
			} else {
				this.apiPersonaService.getPersonaPorNumeroDocumento(documento)
				.pipe(take(1))
				.subscribe((persona: IPersona) => {
					if (persona) {
						PopUp.info('Documento duplicado', `Ya existe una persona con el número de documento '${ documento }'.`);
					} else {
						this.matriculaService.setEstudiante(personaForm);
						this.matriculaService.setTabActive(2);	
					}
				});
			}
		});
	}

	resetFormPersona(): void {
		this.matriculaService.showSearchAcudiente = true;
		if (this.matriculaService.estudianteExiste) {
			this.formPersona.resetFormPersona();
			this.matriculaService.setEstudiante(null);	
			this.matriculaService.setAcudiente(null);	
			this.matriculaService.estudianteExiste = false;
		} else {
			this.formPersona.resetFormPersona();
			this.matriculaService.setEstudiante(null);
		}
	}

}