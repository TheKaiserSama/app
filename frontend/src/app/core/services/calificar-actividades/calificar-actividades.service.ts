import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

import { ApiActividadService } from '@api/api-actividad.service';
import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiLogroService } from '@api/api-logro.service';
import { ApiMatriculaService } from '@api/api-matricula.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { ApiPlanDocenteService } from '@api/api-plan-docente.service';
import { IActividad, IAlmacenPlanDocente, IAnioLectivo, ICurso, ILogro, IMatricula, IPeriodo, IPlanDocente } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';

interface queryParams { id_curso: number, id_periodo: number };

@Injectable({
	providedIn: 'root'
})
export class CalificarActividadesService {

	private _planesDocente$ = new BehaviorSubject<IPlanDocente[]>([]);
	private _logros$ = new BehaviorSubject<ILogro[]>([]);
	private _actividades$ = new BehaviorSubject<IActividad[]>([]);
	private _matriculas$ = new BehaviorSubject<IMatricula[]>([]);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _isOpenModalPlanDocente$ = new BehaviorSubject<boolean>(false);
	
	planesDocente$: Observable<IPlanDocente[]> = this._planesDocente$.asObservable();
	logros$: Observable<ILogro[]> = this._logros$.asObservable();
	actividades$: Observable<IActividad[]> = this._actividades$.asObservable();
	matriculas$: Observable<IMatricula[]> = this._matriculas$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	isOpenModalPlanDocente$: Observable<boolean> = this._isOpenModalPlanDocente$.asObservable();

	page: number = 1;
	pageSize: number = 10;
	idDocente: number;
	queryPlanesDocente: queryParams = { id_curso: null, id_periodo: null };
	selectedLogro: ILogro;
	selectedActividad: IActividad;
	planDocente: IPlanDocente;
	
	constructor(
		private apiActividadService: ApiActividadService,
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiLogroService: ApiLogroService,
		private apiMatriculaService: ApiMatriculaService,
		private apiPeriodoService: ApiPeriodoService,
		private apiPlanDocenteService: ApiPlanDocenteService,
	) { }

	getPlanesDocente(): void {
		this._loading$.next(true);
		const objParams = {
			limit: this.pageSize,
			offset: this._offset$.value,
			...this.queryPlanesDocente
		};
		this.apiPlanDocenteService.getPlanesDocente(this.idDocente, objParams).pipe(
			map((planDocentes: IAlmacenPlanDocente) => {
				this._collectionSize$.next(planDocentes.count);
				return planDocentes.rows.map((docente: IPlanDocente, index: number) =>
					({ index: this._offset$.value + index + 1, ...docente }));
			}),
			take(1)
		)
		.subscribe((planesDocente: IPlanDocente[]) => {
			this._loading$.next(false);
			this._planesDocente$.next(planesDocente);
		});
	}

	getLogrosPorPlanDocente(id: number): void {
		this._loading$.next(true);
		this.apiLogroService.getLogrosPorPlanDocente(id)
		.pipe(take(1))
		.subscribe((logros: ILogro[]) => {
			this._loading$.next(false);
			this._logros$.next(logros);
		});
	}

	getActividadesPorLogro(id: number): void {
		this._loading$.next(true);
		this.apiActividadService.getActividadesPorLogro(id)
		.pipe(take(1))
		.subscribe((actividades: IActividad[]) => {
			this._loading$.next(false);
			this._actividades$.next(actividades);
		});
	}

	getMatriculaByIdCurso(): void {
		this._loading$.next(true);
		this.apiMatriculaService.getMatriculaByIdCurso(this.planDocente.id_curso)
		.pipe(take(1))
		.subscribe((matriculas: IMatricula[]) => {
			this._loading$.next(false);
			this._matriculas$.next(matriculas);
		});
	}

	getCursosPorDocente(): Observable<ICurso[]> {
		return this.getCurrentAnioLectivo().pipe(
			concatMap((anioLectivo: IAnioLectivo) =>
			this.apiPlanDocenteService.getCursosPorDocente(this.idDocente, { id_anio_lectivo: anioLectivo.id }))
		);
	}

	getCurrentAnioLectivo(): Observable<IAnioLectivo> {
		return this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear())
			.pipe(
				concatMap((anioLectivo: IAnioLectivo) => this.apiAnioLectivoService.getAnioLectivoByPk(anioLectivo.id)),
				take(1)
			)
	}

	getPeriodos(): Observable<IPeriodo[]> {
		return this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear())
			.pipe(
				concatMap((anioLectivo: IAnioLectivo) => this.apiPeriodoService.getPeriodosPorAnioLectivo(anioLectivo.id)),
				take(1)
			);
	}

	updateTablaPlanesDocente(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getPlanesDocente();
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	closeModalPlanDocente(value: boolean): void {
		this._isOpenModalPlanDocente$.next(value);
	}

	initStatePlanDocente(): void {
		this.page = 1;
		this.pageSize = 10;
		this.idDocente = null;
		this.queryPlanesDocente = { id_curso: null, id_periodo: null };
	}

	initStateCalificar(): void {
		this._planesDocente$.next([]);
		this._logros$.next([]);
		this._actividades$.next([]);
		this._matriculas$.next([]);
		this.selectedLogro = null;
		this.selectedActividad = null;
		this.planDocente = null;
	}

	setActividades(actividades: IActividad[]): void {
		this._actividades$.next(actividades);
	}

}
