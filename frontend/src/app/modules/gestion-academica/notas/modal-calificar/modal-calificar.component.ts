import { Component, OnInit } from '@angular/core';

import { CalificarActividadesService } from '@services/calificar-actividades/calificar-actividades.service';
import { NotaService } from '@services/nota/nota.service';

@Component({
	selector: 'app-modal-calificar',
	templateUrl: './modal-calificar.component.html',
	styleUrls: ['./modal-calificar.component.scss']
})
export class ModalCalificarComponent implements OnInit {

	stylesMax = {
		titulo: 'NOTAS MÁS ALTAS',
		icono: 'fa fa-smile-o',
		color: '#00A65A'
	};

	stylesMin = {
		titulo: 'NOTAS MÁS BAJAS',
		icono: 'fa fa-frown-o',
		color: '#DD4B39'
	};

	stylesPro = {
		titulo: 'NOTA PROMEDIO',
		icono: 'fa fa-bar-chart',
		color: '#F39C12'
	};

	constructor(
		public calificarActividadesService: CalificarActividadesService,
		public notaService: NotaService
	) { }

	ngOnInit(): void { }

	guardarNotasActividades(): void {
		this.notaService.guardarNotasActividades();
	}
	
}