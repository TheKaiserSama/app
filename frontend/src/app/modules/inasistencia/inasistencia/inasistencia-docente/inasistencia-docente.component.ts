import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { CursosDocenteComponent } from '../../cursos-docente/cursos-docente.component';
import { RegistrarInasistenciaComponent } from '../../registrar-inasistencia/registrar-inasistencia.component';
import { ApiAnioLectivoService } from'@api/api-anio-lectivo.service';
import { ApiInstitucionService } from'@api/api-institucion.service';
import { ApiPlanDocenteService } from'@api/api-plan-docente.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { InasistenciaDocenteService } from '@services/inasistencia-docente/inasistencia-docente.service';
import { IAnioLectivo, ICurso, IDocente, IInasistencia, IMateria, ISede } from '@interfaces/all.interface';
import { getCurrentDate, getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-inasistencia-docente',
	templateUrl: './inasistencia-docente.component.html',
	styleUrls: ['./inasistencia-docente.component.scss']
})
export class InasistenciaDocenteComponent implements OnInit, OnDestroy {

	collectionSize$: Observable<number> = this.inasistenciaDocenteService.collectionSize$;
	offset$: Observable<number> = this.inasistenciaDocenteService.offset$;
	inasistencias$: Observable<IInasistencia[]> = this.inasistenciaDocenteService.inasistencias$;
	sedes$: Observable<ISede[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	cursos$: Observable<ICurso[]>;
	materias$: Observable<IMateria[]>;
	ctrFilter: FormControl = new FormControl('');
	ctrSede: FormControl = new FormControl(null);
	ctrAnioLectivo: FormControl = new FormControl(null);
	ctrCurso: FormControl = new FormControl(null);
	ctrMateria: FormControl = new FormControl(null);
	docente: IDocente = this.authService.currentUserValue.docente;
	
	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiInstitucionService: ApiInstitucionService,
		private apiPlanDocenteService: ApiPlanDocenteService,
		private authService: AuthenticationService,
		private modalService: NgbModal,
		public inasistenciaDocenteService: InasistenciaDocenteService,
	) { }

	ngOnInit(): void {
		this.sedes$ = this.apiInstitucionService.getSedes();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.inasistenciaDocenteService.getInasistenciasDocente();
		this.getInasistenciasFilter();
		this.cursos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear()).pipe(
			concatMap((anioLectivo: IAnioLectivo) => 
			this.apiPlanDocenteService.getCursosPorDocente(this.docente.id, { id_anio_lectivo: anioLectivo.id }))
		);
	}

	ngOnDestroy(): void {
		this.inasistenciaDocenteService.initStateInasistenciasDocente();
	}

	onChange(value: string): void {
		this.inasistenciaDocenteService.pageSize = +value;
		this.inasistenciaDocenteService.updateTablaInasistenciasDocente();
	}
	
	onPageChange(page: number): void {
		this.inasistenciaDocenteService.page = page;
		this.inasistenciaDocenteService.updateTablaInasistenciasDocente();
	}

	validateOffset(): number {
		return this.inasistenciaDocenteService.validateOffset();
	}

	handleSede(sede: ISede): void { // No se esta usando
		this.ctrAnioLectivo.setValue(null, { emitViewToModelChange: false });
		this.ctrCurso.setValue(null, { emitViewToModelChange: false });
		this.ctrMateria.setValue(null, { emitViewToModelChange: false });
		if (!sede) {
			this.inasistenciaDocenteService.objParams.id_sede = null;
		} else {
			this.inasistenciaDocenteService.objParams.id_sede = sede.id;
		}
		this.inasistenciaDocenteService.updateTablaInasistenciasDocente();
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		this.ctrCurso.setValue(null, { emitViewToModelChange: false });
		this.ctrMateria.setValue(null, { emitViewToModelChange: false });
		this.inasistenciaDocenteService.objParams.id_curso = null;
		this.inasistenciaDocenteService.objParams.id_materia = null;
		this.materias$ = of([]);
		if (anioLectivo && anioLectivo.id) {
			this.inasistenciaDocenteService.objParams.id_anio_lectivo = anioLectivo.id;
			this.cursos$ = this.apiPlanDocenteService.getCursosPorDocente(this.docente.id, { id_anio_lectivo: anioLectivo.id });
		} else {
			this.inasistenciaDocenteService.objParams.id_anio_lectivo = null;
			this.cursos$ = of([]);
		}
		this.inasistenciaDocenteService.updateTablaInasistenciasDocente();
	}

	handleCurso(curso: ICurso): void {
		this.ctrMateria.setValue(null, { emitViewToModelChange: false });
		this.inasistenciaDocenteService.objParams.id_materia = null;
		if (curso && curso.id) {
			this.inasistenciaDocenteService.objParams.id_curso = curso.id;
			if (this.ctrAnioLectivo.value) {
				const { id: id_anio_lectivo } = this.ctrAnioLectivo.value;
				const { id: id_grado } = curso.grado;
				if (id_anio_lectivo && id_grado) {
					 this.materias$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear()).pipe(
						concatMap((anioLectivo: IAnioLectivo) => 
						this.apiPlanDocenteService.getMateriasPorDocente(this.docente.id, { id_anio_lectivo: anioLectivo.id, id_curso: curso.id }))
					);
				}
			}
		} else {
			this.inasistenciaDocenteService.objParams.id_curso = null;
			this.materias$ = of([]);
		}
		this.inasistenciaDocenteService.updateTablaInasistenciasDocente();
	}

	handleMateria(materia: IMateria): void {
		if (materia && materia.id)
			this.inasistenciaDocenteService.objParams.id_materia = materia.id;
		else
			this.inasistenciaDocenteService.objParams.id_materia = null;
		this.inasistenciaDocenteService.updateTablaInasistenciasDocente();
	}

	openTomarInasistencia(): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		this.modalService.open(CursosDocenteComponent, modalOptions);
	}
	
	updateInasistencias(inasistencia: IInasistencia): void {
		if (!inasistencia) return;
		const { fecha = getCurrentDate(), plan_docente } = inasistencia;
		this.inasistenciaDocenteService.getMatriculaByIdCurso(plan_docente, { fechaNotificacion: fecha });
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		const modalRef = this.modalService.open(RegistrarInasistenciaComponent, modalOptions);
		modalRef.componentInstance.fecha = fecha;
		modalRef.componentInstance.planDocente = inasistencia.plan_docente;
	}

	private getInasistenciasFilter(): void {
		this.ctrFilter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((search_term: string) => {
				this.inasistenciaDocenteService.objParams.search_term = search_term.toLowerCase();
				return this.inasistenciaDocenteService.requestApiInasistenciasDocente();
            })
		)
		.subscribe((inasistencias: IInasistencia[]) =>
		this.inasistenciaDocenteService.handleSubscribeInasistenciasDocente(inasistencias));
	}

}