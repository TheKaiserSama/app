import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TIPOS_REPORTES, REPORTES_ADMINISTRADOR } from '@shared/const';

interface ITipoReporte {
	id?: number;
	nombre?: string;
}

@Component({
	selector: 'app-reportes-administrador',
	templateUrl: './reportes-administrador.component.html',
	styleUrls: ['./reportes-administrador.component.scss']
})
export class ReportesAdministradorComponent implements OnInit {

	shouldPrint: boolean = true;
	botonElegirBoletin: boolean = true;
	botonElegirConsolidado: boolean = true;
	ctrTipoReporte: FormControl = new FormControl(null);
	TIPOS_REPORTES = TIPOS_REPORTES;
	tiposReportes: ITipoReporte[] = [];
	tipoReporte: ITipoReporte = {};

	constructor() { }

	ngOnInit(): void {
		this.tiposReportes = REPORTES_ADMINISTRADOR;
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

}
