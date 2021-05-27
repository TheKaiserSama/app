import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { CalificarActividadesService } from '@services/calificar-actividades/calificar-actividades.service';
import { NotaService } from '@services/nota/nota.service';
import { ICurso, IPeriodo, IPlanDocente } from '@interfaces/all.interface';

@Component({
	selector: 'app-modal-elegir-curso',
	templateUrl: './modal-elegir-curso.component.html',
	styleUrls: ['./modal-elegir-curso.component.scss']
})
export class ModalElegirCursoComponent implements OnInit, OnDestroy {

	storePlanDocentes$: Observable<IPlanDocente[]> = this.calificarActividadesService.planesDocente$;
	collectionSize$: Observable<number> = this.calificarActividadesService.collectionSize$;
	offset$: Observable<number> = this.calificarActividadesService.offset$;
	cursos$: Observable<ICurso[]>;
	periodos$: Observable<IPeriodo[]>;
	ctrCurso: FormControl = new FormControl(null);
	ctrPeriodo: FormControl = new FormControl(null);

	constructor(
		private notaService: NotaService,
		public calificarActividadesService: CalificarActividadesService,
	) { }

	ngOnInit(): void {
		this.cursos$ = this.calificarActividadesService.getCursosPorDocente();
		this.periodos$ = this.calificarActividadesService.getPeriodos();
	}

	ngOnDestroy(): void {
		this.calificarActividadesService.initStatePlanDocente();
	}

	onChangePageSize(value: string): void {
		this.calificarActividadesService.pageSize = +value;
		this.calificarActividadesService.updateTablaPlanesDocente();
	}
	
	onPageChange(page: number): void {
		this.calificarActividadesService.page = page;
		this.calificarActividadesService.updateTablaPlanesDocente();
	}

	validateOffset(): number {
		return this.calificarActividadesService.validateOffset();
	}

	handleCurso(curso: ICurso): void {
		if (curso && curso.id)
			this.calificarActividadesService.queryPlanesDocente.id_curso = curso.id;
		else
			this.calificarActividadesService.queryPlanesDocente.id_curso = null;
		this.calificarActividadesService.updateTablaPlanesDocente();
	}

	handlePeriodo(periodo: IPeriodo): void {
		if (periodo && periodo.id)
			this.calificarActividadesService.queryPlanesDocente.id_periodo = periodo.id;
		else
			this.calificarActividadesService.queryPlanesDocente.id_periodo = null;
		this.calificarActividadesService.updateTablaPlanesDocente();
	}

	cargarEstudiantes(planDocente: IPlanDocente): void {
		const { id, id_periodo, curso: { grado, grupo } } = planDocente;
		this.calificarActividadesService.initStateCalificar();
		this.calificarActividadesService.closeModalPlanDocente(true);

		this.calificarActividadesService.planDocente = planDocente;
		this.calificarActividadesService.getLogrosPorPlanDocente(id);

		// this.notaService.id_periodo = id_periodo;
		this.notaService.curso = planDocente.curso;
		// this.notaService.resetNotas();
	}

}