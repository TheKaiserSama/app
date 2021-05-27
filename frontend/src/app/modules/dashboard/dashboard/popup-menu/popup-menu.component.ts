import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, take } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiEstudianteService } from '@api/api-estudiante.service';
import { ApiNotificacionService } from '@api/api-notificacion.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { IEstudiante, INotificacion, IUsuario } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';
import { ROL }  from '@shared/const';

@Component({
	selector: 'app-popup-menu',
	templateUrl: './popup-menu.component.html',
	styleUrls: ['./popup-menu.component.scss']
})
export class PopupMenuComponent implements OnInit {

	@Input() notificaciones: any;
	usuario: IUsuario = this.authService.currentUserValue;
	ROL = ROL;

	constructor(
		private apiEstudianteService: ApiEstudianteService,
		private apiNotificacionService: ApiNotificacionService,
		private authService: AuthenticationService,
		private router: Router,
	) { }

	ngOnInit(): void { }

	seleccionarNotificacion(id: number): void {
		const { id: id_persona } = this.authService.currentUserValue.persona;
		this.router.navigate(['/dashboard/notificaciones/notificaciones']);
		this.apiNotificacionService.updateNotificacion(id, { visto: true })
		.pipe(
			concatMap((notification: INotificacion) => this.apiEstudianteService.getEstudianteByPkPersona(id_persona)),
			concatMap((estudiante: IEstudiante) => this.apiNotificacionService.getUltimasNotificaciones(estudiante.id)),
			take(1)
		)
		.subscribe((notificaciones: INotificacion[]) => this.notificaciones = notificaciones);
	}

	cerrarSesion(): void {
		PopUp.question('Cerrar sesión', 'Esta a punto de salir de la aplicación?').then((result: SweetAlertResult) => {
			if (result.value) {
				this.authService.logout();
			}
		});
	}
	
}