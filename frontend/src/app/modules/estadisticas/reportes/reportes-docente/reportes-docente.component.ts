import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { TIPOS_REPORTES, REPORTES_DOCENTE, REPORTES_DIRECTOR_GRUPO } from '@shared/const';

interface ITipoReporte {
	id?: number;
	nombre?: string;
}

@Component({
	selector: 'app-reportes-docente',
	templateUrl: './reportes-docente.component.html',
	styleUrls: ['./reportes-docente.component.scss']
})
export class ReportesDocenteComponent implements OnInit {

	ctrTipoReporte: FormControl = new FormControl(null);
	TIPOS_REPORTES = TIPOS_REPORTES;
	tiposReportes: ITipoReporte[] = [];
	tipoReporte: ITipoReporte = {};

	constructor(private authService: AuthenticationService) { }

	ngOnInit(): void {
		this.tiposReportes = this.getTiposReportes();
	}

	handleTipoReporte(tipoReporte: ITipoReporte): void {
		if (!tipoReporte) return;
		let { nombre } = tipoReporte;
		nombre = nombre.toLowerCase();
		if (nombre == TIPOS_REPORTES.BOLETINES.nombre)
			this.tipoReporte = TIPOS_REPORTES.BOLETINES;
		else if (nombre == TIPOS_REPORTES.CONSOLIDADOS.nombre)
			this.tipoReporte = TIPOS_REPORTES.CONSOLIDADOS;
		else
			this.tipoReporte = {};
	}

	private getTiposReportes(): ITipoReporte[] {
		const usuario = this.authService.currentUserValue;
		if (usuario && usuario.docente && usuario.docente.director_grupo) {
			const listaReportes = REPORTES_DOCENTE.concat(REPORTES_DIRECTOR_GRUPO);
			return listaReportes.sort(this.compare);
		} else {
			return REPORTES_DOCENTE;
		}
	}

	private compare(a: any, b: any): number {
		// Use toUpperCase() to ignore character casing
		const nombreA = a.nombre.toUpperCase();
		const nombreB = b.nombre.toUpperCase();
	  
		let comparison = 0;
		if (nombreA > nombreB) {
		  	comparison = 1;
		} else if (nombreA < nombreB) {
		  	comparison = -1;
		}
		return comparison;
	}

}
