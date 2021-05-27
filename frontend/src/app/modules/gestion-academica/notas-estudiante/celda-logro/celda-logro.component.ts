import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { NotaEstudianteService } from '@services/nota-estudiante/nota-estudiante.service';
import { ILogro } from '@interfaces/all.interface';

@Component({
	selector: '[my-tr]',
	templateUrl: './celda-logro.component.html',
	styleUrls: ['./celda-logro.component.scss']
})
export class CeldaLogroComponent implements OnInit {

	@Input() materia;
	@Input() index: number;
	periodos = [];
	logro: ILogro = {};

	constructor(
		private modalService: NgbModal,
		private notaEstudianteService: NotaEstudianteService,
	) { }

	ngOnInit(): void {
		const materiaCopia = { ...this.materia };
		delete materiaCopia.materia;
		delete materiaCopia.longitud;
		for (const property in materiaCopia)
			this.periodos.push(materiaCopia[property]);
	}

	valueDataCell(logro: any): any {
		return logro ? (logro?.nota) ? logro.nota : 'En proceso' : '';
	}

	openModalLogro(content: any, logro: ILogro): void {
		if (!logro) return;
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			windowClass: 'modal-1000px'
		};
		this.logro = logro;
		this.notaEstudianteService.getActividadesPorLogro(logro.id);
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => { });
	}

}
