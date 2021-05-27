import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { MatriculaService } from '@services/matricula/matricula.service';

@Component({
	selector: 'app-matricula',
	templateUrl: './matricula.component.html',
	styleUrls: ['./matricula.component.scss']
})
export class MatriculaComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	
	constructor(
		private modalService: NgbModal,
		public matriculaService: MatriculaService,
	) { }

	ngOnInit(): void {
		this.matriculaService.closeFormMatricula$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((closeModal: boolean) => {
            if (closeModal) this.modalService.dismissAll();
        });
	}

	ngOnDestroy(): void {
		this.matriculaService.initStateMatricula();
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
            this.matriculaService.initStateCloseModal();	
        });
	}
	
	editar(editar: boolean, content: any): void {
        if (editar) this.open(content);
    }

}