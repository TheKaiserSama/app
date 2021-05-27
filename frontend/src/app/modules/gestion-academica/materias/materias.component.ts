import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { AreaService } from '@services/area/area.service';
import { MateriaService } from '@services/materia/materia.service';

@Component({
	selector: 'app-materias',
	templateUrl: './materias.component.html',
	styleUrls: ['./materias.component.scss']
})
export class MateriasComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	modalOptions: NgbModalOptions = {
        ariaLabelledBy: 'modal-basic',
        backdrop: 'static',
        keyboard: false,
		windowClass: 'form-small',
	};
	
	constructor(
		private areaService: AreaService,
		private materiaService: MateriaService,
		private modalService: NgbModal
	) { }

	ngOnInit(): void {
		this.materiaService.shouldCloseFormMateria$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((closeModal: boolean) => {
			if (closeModal) this.modalService.dismissAll();
		});
	}

	ngOnDestroy(): void {
		this.materiaService.initStateMateria();
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}
	
	openModalArea(content: any): void {
		const modalOptions: NgbModalOptions = { ...this.modalOptions, windowClass: 'form-area' };
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => {
			this.areaService.initStateArea();
        });
	}

	openModalMateria(content: any): void {
		this.modalService.open(content, this.modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.materiaService.initStateCloseFormMateria();
        });
	}

	editar(editar: boolean, content: any): void {
        if (editar) this.openModalMateria(content);
    }

}