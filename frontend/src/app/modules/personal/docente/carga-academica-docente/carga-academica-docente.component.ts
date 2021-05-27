import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { PlanDocenteService } from '@services/plan-docente/plan-docente.service';
import { DocenteService } from '@services/docente/docente.service';

@Component({
	selector: 'app-carga-academica-docente',
	templateUrl: './carga-academica-docente.component.html',
	styleUrls: ['./carga-academica-docente.component.scss']
})
export class CargaAcademicaDocenteComponent implements OnInit, OnDestroy, AfterViewInit {

	private unsubscribe = new Subject();
	@ViewChild('content') content: any;

	constructor(
		private docenteService: DocenteService,
		private modalService: NgbModal,
		private planDocenteService: PlanDocenteService,
	) { }

	ngOnInit(): void { }

	ngOnDestroy(): void {
		this.planDocenteService.initStatePlanDocente();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngAfterViewInit(): void {
		this.docenteService.openModalCargaAcademica$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((openModal: boolean) => {
			if (!openModal) return this.modalService.dismissAll();
			this.open(this.content);
		});
	}

	open(content: any): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'xl',
			windowClass: 'myCustomModalClass'
		};
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => {
			this.docenteService.setOpenModalCargaAcademica(false);
			this.planDocenteService.initStateCloseModal();
        });
    }

}