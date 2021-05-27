import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { DocenteService } from '@services/docente/docente.service';

@Component({
	selector: 'app-docente',
	templateUrl: './docente.component.html',
	styleUrls: ['./docente.component.scss']
})
export class DocenteComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	
	constructor(
        private modalService: NgbModal,
		public docenteService: DocenteService
	) { }

	ngOnInit(): void {
		this.docenteService.closeFormDocente$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((closeModal: boolean) => {
            if (closeModal) this.modalService.dismissAll();
        });
	}

	ngOnDestroy(): void {
		this.docenteService.initStateDocente();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	open(content: any): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.docenteService.initStateCloseModal();
        });
	}
	
	editar(editar: boolean, content: any): void {
        if (editar) this.open(content);
	}
	
}