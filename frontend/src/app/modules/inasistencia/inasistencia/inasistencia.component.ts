import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { IUsuario } from '@interfaces/all.interface';
import { ROL } from '@shared/const';

@Component({
	selector: 'app-inasistencia',
	template: `
		<app-inasistencia-administrador
			*ngIf="usuario && usuario.rol.nombre == ROL.ADMINISTRADOR.nombre">
		</app-inasistencia-administrador>

		<app-inasistencia-docente
			*ngIf="usuario && usuario.rol.nombre == ROL.DOCENTE.nombre">
		</app-inasistencia-docente>

		<app-inasistencia-estudiante
			*ngIf="usuario && usuario.rol.nombre == ROL.ESTUDIANTE.nombre">
		</app-inasistencia-estudiante>
	`,
	styleUrls: ['./inasistencia.component.scss']
})
export class InasistenciaComponent implements OnInit {

	usuario: IUsuario = this.authService.currentUserValue;
	ROL = ROL;
	
	constructor(public authService: AuthenticationService) { }

	ngOnInit(): void { }

}