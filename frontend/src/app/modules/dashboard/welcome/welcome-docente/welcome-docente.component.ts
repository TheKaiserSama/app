import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { IPersona } from '@interfaces/all.interface';

@Component({
	selector: 'app-welcome-docente',
	template: `
		<p>BIENVENIDO: {{ nombreDocente }}</p>
	`,
	styleUrls: ['./welcome-docente.component.scss']
})
export class WelcomeDocenteComponent implements OnInit {

	nombreDocente: string = '';

	constructor(private authService: AuthenticationService) { }

	ngOnInit(): void {
		const { persona } = this.authService.currentUserValue;
		if (persona){
			this.nombreDocente = this.getNombreDocente(persona);
		}
	}

	getNombreDocente(persona: IPersona): string {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = persona;
		return `${ primer_nombre || '' } ${ segundo_nombre || '' } ${ primer_apellido || '' } ${ segundo_apellido || '' }`;
	}

}
