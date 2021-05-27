import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { IUsuario } from '@interfaces/all.interface';
import { ROL } from '@shared/const';

@Component({
	selector: 'app-notificacion',
	template: `
		<h3>Lista de notificaciones</h3>

		<app-notificacion-estudiante
			*ngIf="usuario && usuario.rol.nombre == ROL.ESTUDIANTE.nombre">
		</app-notificacion-estudiante>
		
		<app-notificacion-docente
			*ngIf="usuario && usuario.rol.nombre == ROL.DOCENTE.nombre">
		</app-notificacion-docente>
	`,
	styles: []
})
export class NotificacionComponent implements OnInit {

	usuario: IUsuario = this.authService.currentUserValue;
	ROL = ROL;
	
	constructor(public authService: AuthenticationService) { }

	ngOnInit(): void { }

}