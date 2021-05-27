import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { IUsuario } from '@interfaces/all.interface';
import { ROL } from '@shared/const';

@Component({
	selector: 'app-reportes',
	template: `
		<app-reportes-administrador
			*ngIf="usuario && usuario.rol.nombre == ROL.ADMINISTRADOR.nombre">
		</app-reportes-administrador>

		<app-reportes-docente
			*ngIf="usuario && usuario.rol.nombre == ROL.DOCENTE.nombre">
		</app-reportes-docente>
	`,
	styles: []
})
export class ReportesComponent implements OnInit {

	usuario: IUsuario = this.authService.currentUserValue;
	ROL = ROL;

	constructor(public authService: AuthenticationService) { }

	ngOnInit(): void { }

}
