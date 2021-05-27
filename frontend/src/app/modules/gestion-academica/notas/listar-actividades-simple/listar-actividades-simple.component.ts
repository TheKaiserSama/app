import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { CalificarActividadesService } from '@services/calificar-actividades/calificar-actividades.service';
import { NotaService } from '@services/nota/nota.service';
import { IActividad } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-actividades-simple',
	templateUrl: './listar-actividades-simple.component.html',
	styleUrls: ['./listar-actividades-simple.component.scss']
})
export class ListarActividadesSimpleComponent implements OnInit {

	actividades$: Observable<IActividad[]> = this.calificarActividadesService.actividades$;
	
	constructor(
		private modalService: NgbModal,
		private notaService: NotaService,
		public calificarActividadesService: CalificarActividadesService,
	) { }

	ngOnInit(): void { }

	marcarActividad(content: any, actividad: IActividad): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			windowClass: 'modal-1200px'
		};

		this.calificarActividadesService.selectedActividad = actividad;
		this.notaService.getEstadisticasNotas(actividad.id);
		this.notaService.idActividad = actividad.id;
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => { });
	}

}