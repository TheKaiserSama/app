import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, take } from 'rxjs/operators';

import { ApiOtrosService } from '@api/api-otros.service';
import { FormPersonaComponent } from '@modules/personal/shared/components/form-persona/form-persona.component';
import { MatriculaService } from '@services/matricula/matricula.service';
import { IPersona, IRol } from '@interfaces/all.interface';
import { ROL } from "@shared/const";

@Component({
	selector: 'app-info-acudiente',
	templateUrl: './info-acudiente.component.html',
	styleUrls: ['./info-acudiente.component.scss']
})
export class InfoAcudienteComponent implements OnInit, OnDestroy {

    @ViewChild(FormPersonaComponent) formPersona: FormPersonaComponent;
    private ngUnsubscribe = new Subject();
	roles$: Observable<IRol[]>;
	button = { show: false };
	statusForm: boolean = true;

	constructor(
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
			
            this.matriculaService.acudiente$
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((acudiente: IPersona) => {
                const idRol = (!acudiente) ? ROL.OTRO.nombre : acudiente.rol.nombre;
				this.roles$ = this.apiOtrosService.getRoles([idRol]).pipe(
                    map((roles: IRol[]) => {
						this.formPersona.controls['rol'].disable();
						this.formPersona.controls['rol'].setValue(roles[0]);
                        return roles;
                    })
                );
				if (acudiente) this.formPersona.setPersona(acudiente);
				if (!acudiente) this.formPersona.resetFormPersona();
			});
		});
    }

	ngOnDestroy(): void {
		this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

	handleStatusForm(value: boolean): void {
		this.statusForm = value;
	}

	handleChangeTab(numberTab: number): void {
		const persona = this.formPersona.getPersona();
		this.matriculaService.setAcudiente(persona);
		this.matriculaService.setTabActive(numberTab);
	}

	handleNumeroDocumento(numeroDocumento: string): void {
		this.matriculaService.getPersonaAcudiente(numeroDocumento);
	}

	resetFormPersona(): void {
		this.formPersona.resetFormPersona();
		this.matriculaService.setAcudiente(null);
	}

}