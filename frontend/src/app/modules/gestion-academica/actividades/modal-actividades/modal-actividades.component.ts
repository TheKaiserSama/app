import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ConfirmationModalComponent } from '@modules/shared/components/confirmation-modal/confirmation-modal.component';
import { ActividadService } from '@services/actividad/actividad.service';

@Component({
	selector: 'app-modal-actividades',
	templateUrl: './modal-actividades.component.html',
	styleUrls: ['./modal-actividades.component.scss']
})
export class ModalActividadesComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject(); 
	@ViewChild('content') content: any;

	constructor(
		private modalService: NgbModal,
		private actividadService: ActividadService
	) { }

	ngOnInit(): void { }

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngAfterViewInit(): void {
		this.actividadService.openModalActividad$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((openModal: boolean) => {
			if (!openModal) return this.modalService.dismissAll();
			this.open(this.content);
		});
	}

	closeModal(modal: NgbActiveModal): void {
		// if (this.actividadService.listActividades.length > 0)
		// 	this.modalService.open(ConfirmationModalComponent)
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
			this.actividadService.setOpenModalActividad(false);
			this.actividadService.cleanActividades();
        });
    }

}