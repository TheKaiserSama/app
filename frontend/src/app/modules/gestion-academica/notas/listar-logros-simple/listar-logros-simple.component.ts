import { Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { ListarResumenActividadesComponent } from '@modules/gestion-academica/notas/listar-resumen-actividades/listar-resumen-actividades.component';
import { CalificarActividadesService } from '@services/calificar-actividades/calificar-actividades.service';
import { NotaService } from '@services/nota/nota.service';
import { ILogro } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-logros-simple',
	templateUrl: './listar-logros-simple.component.html',
	styleUrls: ['./listar-logros-simple.component.scss']
})
export class ListarLogrosSimpleComponent implements OnInit {

	logros$: Observable<ILogro[]> = this.calificarActividadesService.logros$;

	constructor(
		private modalService: NgbModal,
		private notaService: NotaService,
		public calificarActividadesService: CalificarActividadesService,
	) { }

	ngOnInit(): void { }

	getActividades(logro: ILogro): void {
		this.calificarActividadesService.setActividades([]);
		this.calificarActividadesService.selectedActividad = null;

		this.calificarActividadesService.selectedLogro = logro;
		this.calificarActividadesService.getActividadesPorLogro(logro.id);
		this.notaService.showModalConfirm = false;
	}

	openModalResumenActividades(logro: ILogro): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		this.notaService.resumenActividades(logro.id);
		const modalRef = this.modalService.open(ListarResumenActividadesComponent, modalOptions);
		modalRef.componentInstance.logro = logro;
	}
	
}