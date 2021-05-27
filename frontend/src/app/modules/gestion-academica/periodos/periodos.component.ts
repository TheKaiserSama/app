import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AnioLectivoService } from '@services/anio-lectivo/anio-lectivo.service';
import { PeriodoService } from '@services/periodo/periodo.service';

@Component({
	selector: 'app-periodos',
	templateUrl: './periodos.component.html',
	styleUrls: ['./periodos.component.scss']
})
export class PeriodosComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	modalOptions: NgbModalOptions = {
        ariaLabelledBy: 'modal-basic',
        backdrop: 'static',
        keyboard: false,
		windowClass: 'modal-anio-lectivo',
	};

	constructor(
		private anioLectivoService: AnioLectivoService,
		private modalService: NgbModal,
		public periodoService: PeriodoService,
	) { }

	ngOnInit(): void {
		this.periodoService.shouldCloseFormPeriodo$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((closeModal: boolean) => {
			if (closeModal) this.modalService.dismissAll();
		});
	}

	ngOnDestroy(): void {
		this.periodoService.initStatePeriodo();
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	openModalAnioLectivo(content: any): void {
		this.modalService.open(content, this.modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.anioLectivoService.initStateAnioLectivo();
        });
	}

	openFormPeriodo(content: any): void {
		const modalOptions: NgbModalOptions = { ...this.modalOptions, windowClass: 'modal-periodo' };
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.periodoService.initStateCloseModal();
        });
	}

	editar(editar: boolean, content: any): void {
        if (editar) this.openFormPeriodo(content);
    }

}