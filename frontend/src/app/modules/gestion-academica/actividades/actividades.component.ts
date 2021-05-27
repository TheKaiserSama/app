import { Component, OnInit } from '@angular/core';

import { LogroService } from "@services/logro/logro.service";

@Component({
	selector: 'app-actividades',
	template: `
		<div class="administracion">
			<div class="contenedor__titulo">
				<h4 class="administracion__titulo">Administración de actividades</h4>
			</div>
		</div>

		<app-logros-actividades></app-logros-actividades>

		<app-listar-actividades></app-listar-actividades>
	`,
	styleUrls: ['./actividades.component.scss']
})
export class ActividadesComponent implements OnInit {

	constructor(
        private logroService: LogroService
	) { }

	ngOnInit(): void {
		this.logroService.initListLogros = true;
	}

}