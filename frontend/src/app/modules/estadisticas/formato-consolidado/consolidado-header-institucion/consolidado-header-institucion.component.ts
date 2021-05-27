import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-consolidado-header-institucion',
	template: `
		<div class="header_institucion">
			<p class="reset_p nombre_institucion">{{ HEADER_INSTITUCION.nombre }}</p>
			<p class="reset_p niveles_institucion">{{ HEADER_INSTITUCION.niveles }}</p>
			<p class="reset_p sedes_institucion">{{ HEADER_INSTITUCION.sedes }}</p>
			<p class="reset_p resolucion_institucion">{{ HEADER_INSTITUCION.resolucion }}</p>
			<p class="reset_p nit_institucion">{{ HEADER_INSTITUCION.nit }}</p>
			<p class="reset_p ubicacion_institucion">{{ HEADER_INSTITUCION.ubicacion }}</p>
		</div>
	`,
	styleUrls: ['./consolidado-header-institucion.component.scss']
})
export class ConsolidadoHeaderInstitucionComponent implements OnInit {

	@Input() HEADER_INSTITUCION;
	
	constructor() { }

	ngOnInit(): void { }

}
