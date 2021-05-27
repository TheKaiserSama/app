import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

import { RegistrarInasistenciaComponent } from '../registrar-inasistencia/registrar-inasistencia.component';
import { ApiPlanDocenteService } from '@api/api-plan-docente.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { InasistenciaDocenteService } from '@services/inasistencia-docente/inasistencia-docente.service';
import { IPlanDocente } from '@interfaces/all.interface';
import { getCurrentDate, getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-cursos-docente',
	templateUrl: './cursos-docente.component.html',
	styleUrls: ['./cursos-docente.component.scss']
})
export class CursosDocenteComponent implements OnInit {

	planesDocentes$: Observable<IPlanDocente[]>;

	constructor(
		private apiPlanDocenteService: ApiPlanDocenteService,
		private authService: AuthenticationService,
		private inasistenciaDocenteService: InasistenciaDocenteService,
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit(): void {
		const { docente } = this.authService.currentUserValue;
		const { year, month, day } = getCurrentDate();
		const fecha = `${ year }-${ month }-${ day }`;
		const params = {
			id_docente: docente.id,
			anio_actual: getCurrentYear(),
			fecha_inicio: fecha,
			fecha_finalizacion: fecha
		};
		this.planesDocentes$ = this.apiPlanDocenteService.getCursosPorPeriodo(params);
	}

	openTomarInasistencia(planDocente: IPlanDocente): void {
		const { year, month, day } = getCurrentDate();
		const fecha = `${ year }-${ month }-${ day }`;
		if (planDocente) {
			this.inasistenciaDocenteService.getMatriculaByIdCurso(planDocente, { fechaNotificacion: fecha });
			const modalOptions: NgbModalOptions = {
				ariaLabelledBy: 'modal-basic',
				backdrop: 'static',
				keyboard: false,
				size: 'lg'
			};
			const modalRef = this.modalService.open(RegistrarInasistenciaComponent, modalOptions);
			modalRef.componentInstance.fecha = fecha;
			modalRef.componentInstance.planDocente = planDocente;
		}
	}

}