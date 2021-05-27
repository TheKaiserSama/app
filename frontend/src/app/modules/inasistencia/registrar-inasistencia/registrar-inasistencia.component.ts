import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { InasistenciaDocenteService } from '@services/inasistencia-docente/inasistencia-docente.service';
import { SocketIoService } from '@services/socket-io/socket-io.service';
import { IInasistencia, IPlanDocente } from '@interfaces/all.interface';
import { getCurrentDate } from '@shared/helpers/transform';

@Component({
	selector: 'app-registrar-inasistencia',
	templateUrl: './registrar-inasistencia.component.html',
	styleUrls: ['./registrar-inasistencia.component.scss']
})
export class RegistrarInasistenciaComponent implements OnInit, OnDestroy {

	private unsubcribe = new Subject();
	@Input() fecha: string;
	@Input() planDocente: IPlanDocente;
	estudiantesPorCurso: IInasistencia[] = [];
	loading: boolean = false;

	constructor(
		private inasistenciaDocenteService: InasistenciaDocenteService,
		private modalService: NgbModal,
		private socketIoService: SocketIoService,
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit(): void {
		this.getEstudiantesPorCurso();
	}

	ngOnDestroy(): void {
		this.unsubcribe.next();
		this.unsubcribe.complete();
	}
	
	getEstudiantesPorCurso(): void {
		this.inasistenciaDocenteService.estudiantesPorCurso$
		.pipe(takeUntil(this.unsubcribe))
		.subscribe((estudiantesPorCurso: IInasistencia[]) => {
			this.estudiantesPorCurso = estudiantesPorCurso;
		});
	}

	guardarInasistencias(): void {
		this.loading = true;
		const { year, month, day } = getCurrentDate();
		const idPlanDocente = this.estudiantesPorCurso[0].id_plan_docente;
		const estudiantesInasistentes = this.estudiantesPorCurso.filter((item: IInasistencia) => item.falta == true);
		const createInasistencias = estudiantesInasistentes
		.map((item: IInasistencia) => ({ ...item, fecha: this.fecha || `${ year }-${ month }-${ day }` }));

		this.inasistenciaDocenteService.createInasistencias(createInasistencias, { idPlanDocente, fecha: this.fecha })
		.pipe(takeUntil(this.unsubcribe))
		.subscribe((data: any) => {
			this.loading = false;
			this.getEstudiantesPorCurso();
			this.socketIoService.emit('sendNotificacion', estudiantesInasistentes);
			this.inasistenciaDocenteService.getInasistenciasDocente();
			this.modalService.dismissAll();
		});
	}

}