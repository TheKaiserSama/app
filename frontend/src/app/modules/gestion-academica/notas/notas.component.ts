import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiDocenteService } from '@api/api-docente.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { CalificarActividadesService } from '@services/calificar-actividades/calificar-actividades.service';
import { NotaService } from '@services/nota/nota.service';
import { IDocente, IUsuario } from '@interfaces/all.interface';
import { ROL } from '@shared/const';

@Component({
	selector: 'app-notas',
	templateUrl: './notas.component.html',
	styleUrls: ['./notas.component.scss']
})
export class NotasComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	usuario: IUsuario = this.authService.currentUserValue;
	ROL = ROL;

	constructor(
		private apiDocenteService: ApiDocenteService,
		private authService: AuthenticationService,
		private modalService: NgbModal,
		private notaService: NotaService,
		public calificarActividadesService: CalificarActividadesService,
	) { }

	ngOnInit(): void {
		this.calificarActividadesService.isOpenModalPlanDocente$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((closeModal: boolean) => {
            if (closeModal) this.modalService.dismissAll();
        });
	}

	ngOnDestroy(): void {
		this.calificarActividadesService.initStateCalificar();
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

	openPlanesDocente(content: any): void {
		const token = this.authService.getItemLocalStorage('token');
		const decodedToken = this.authService.decodeToken(token);
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};

		this.apiDocenteService.getDocenteByPkPersona(decodedToken['persona']['id'])
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((docente: IDocente) => {
            this.calificarActividadesService.idDocente = docente.id;
            this.calificarActividadesService.getPlanesDocente();
		});

		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => { });
	}

	openNotaFinal(content: any): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		this.notaService.resumenLogros(this.calificarActividadesService.idDocente);
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => { });
	}

}