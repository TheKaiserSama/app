import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { FormUsuarioComponent } from '@modules/shared/components/form-usuario/form-usuario.component';
import { PersonaService } from '@services/persona/persona.service';
import { IUsuario } from '@interfaces/all.interface';

@Component({
	selector: 'app-editar-usuario',
	template: `
		<app-form-usuario
			[button]="button"
			(emitUsuario)="handleUsuario($event)">
		</app-form-usuario>
	`,
	styles: []
})
export class EditarUsuarioComponent implements OnInit {

	@ViewChild(FormUsuarioComponent) formUsuario: FormUsuarioComponent;
	button = { text: 'Editar usuario' };

	constructor(private personaService: PersonaService) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.personaService.usuario$
			.pipe(take(1))
			.subscribe((usuario: IUsuario) => {
				if (!usuario) return;
				this.formUsuario.setUsuario(usuario);
			});
		})
	}

	handleUsuario(usuario: IUsuario): void {
		this.personaService.updateUsuario(usuario);
	}

}