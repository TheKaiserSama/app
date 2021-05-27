import { Component, OnInit, Input } from '@angular/core';
import { SweetAlertResult } from 'sweetalert2';

import { AuthenticationService } from "@core/authentication/authentication.service";
import { IMenu } from '@interfaces/menu.interface';
import { MENU_ADMINISTRADOR, MENU_DOCENTE, MENU_ESTUDIANTE, ROL } from "@shared/const";
import { reemplazarCaracteresEspeciales } from '@shared/helpers/menu-sin-caracteres-especiales.helper';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

	@Input() menus: IMenu[];
	@Input() menuSinCaracteresEspeciales: any;
	menu: any = this.getMenu(this.authService.currentUserValue.id_rol);
	funcMenuURL = reemplazarCaracteresEspeciales;

	constructor(private authService: AuthenticationService) { }

	ngOnInit(): void { }

	getMenu(idRol: number): any {
		if (idRol == ROL.ADMINISTRADOR.id) return MENU_ADMINISTRADOR;
		if (idRol == ROL.DOCENTE.id) return MENU_DOCENTE;
		if (idRol == ROL.ESTUDIANTE.id) return MENU_ESTUDIANTE;
	}

	cerrarSesion(): void {
		PopUp.question('Cerrar sesión', 'Esta a punto de salir de la aplicación?').then((result: SweetAlertResult) => {
			if (result.value) {
				this.authService.logout();
			}
		});
	}

	// showMenuItem(menu: any): boolean { // Posiblemente borrar
	// 	console.log(this.authService.currentUserValue);
	// 	if (menu.titulo == 'Directores de grupos') {
	// 		console.log('Mostrar la opción a los directores de grupo');
	// 	}
	// 	return true;
	// }
	
}