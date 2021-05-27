import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { IUsuario } from '@interfaces/all.interface';
import { ROL } from '@shared/const';

@Component({
	selector: 'app-welcome',
	template: `
		<app-welcome-admin
			*ngIf="usuario && usuario.rol.id == ROL.ADMINISTRADOR.id">
		</app-welcome-admin>

		<app-welcome-docente
			*ngIf="usuario && usuario.rol.id == ROL.DOCENTE.id">
		</app-welcome-docente>
	`,
	styles: []
})
export class WelcomeComponent implements OnInit {

	usuario: IUsuario = this.authService.currentUserValue;
	ROL = ROL;

	constructor(private authService: AuthenticationService) { }

	ngOnInit(): void { }

}
