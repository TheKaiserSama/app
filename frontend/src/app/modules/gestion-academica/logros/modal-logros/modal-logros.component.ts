import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ConfirmationModalComponent } from '@modules/shared/components/confirmation-modal/confirmation-modal.component';
import { LogroService } from '@services/logro/logro.service';

@Component({
	selector: 'app-modal-logros',
	templateUrl: './modal-logros.component.html',
	styleUrls: ['./modal-logros.component.scss']
})
export class ModalLogrosComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject(); 
	@ViewChild('content') content: any;
	
	constructor(
		private logroService: LogroService,
		private modalService: NgbModal,
	) { }

	ngOnInit(): void { }

	ngOnDestroy(): void {
		this.logroService.initStateLogro();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngAfterViewInit(): void {
		this.logroService.openModalLogros$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((openModal: boolean) => {
			if (!openModal) return this.modalService.dismissAll();
			this.open(this.content);
		});
	}

	closeModal(modal: NgbActiveModal): void {
		// if (this.logroService.listLogros.length > 0)
		// 	this.modalService.open(ConfirmationModalComponent);
		// else
		// 	modal.dismiss();
		modal.dismiss();
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
			this.logroService.initStateCloseModal();
        });
    }

}