import { Component, OnInit } from '@angular/core';

import { PersonaService } from '@services/persona/persona.service';
import { IUsuario } from '@interfaces/all.interface';

@Component({
	selector: 'app-crear-usuario',
	template: `
		<app-form-usuario
			[button]="button"
			(emitUsuario)="handleUsuario($event)">
		</app-form-usuario>
	`,
	styles: []
})
export class CrearUsuarioComponent implements OnInit {

	button = { text: 'Crear registro' };

	constructor(private personaService: PersonaService) { }

	ngOnInit(): void { }

	handleUsuario(usuario: IUsuario): void {
		this.personaService.setUsuario(usuario);
		this.personaService.createPersonaConUsuario();
	}

}