import { Component, Input, OnInit } from '@angular/core';
import { ICurso } from '@interfaces/all.interface';

@Component({
	selector: 'app-consolidado-header',
	template: `
		<div class="header_consolidado">
			<p class="reset_p header_consolidado__nombre">
				{{ titulo }} - CURSO {{ curso.grado.grado }}° {{ curso.grupo.descripcion }}
			</p>
			<p class="reset_p header_consolidado__anio">AÑO {{ curso.anio_lectivo.anio_actual }}</p>
		</div>
	`,
	styleUrls: ['./consolidado-header.component.scss']
})
export class ConsolidadoHeaderComponent implements OnInit {

	@Input() curso: ICurso;
	@Input() titulo: string;
	
	constructor() { }

	ngOnInit(): void { }

}
