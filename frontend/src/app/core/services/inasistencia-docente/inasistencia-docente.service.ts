import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { ApiDocenteService } from '@api/api-docente.service';
import { ApiInasistenciaService } from '@api/api-inasistencia.service';
import { ApiMatriculaService } from '@api/api-matricula.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { IAlmacenInasistencia, IDocente, IInasistencia, IMatricula, IPlanDocente } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class InasistenciaDocenteService {

	private _inasistencias$ = new BehaviorSubject<IInasistencia[]>([]);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	inasistencias$: Observable<IInasistencia[]> = this._inasistencias$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	estudiantesPorCurso$: Observable<IMatricula[]>;
	page: number = 1;
	pageSize: number = 10;
	objParams: any = {};
	
	constructor(
		private apiDocenteService: ApiDocenteService,
		private apiInasistenciaService: ApiInasistenciaService,
		private apiMatriculaService: ApiMatriculaService,
		private authService: AuthenticationService,
	) { }

	getInasistenciasDocente(): void {
		this.requestApiInasistenciasDocente()
		.subscribe((inasistencias: IInasistencia[]) =>
		this.handleSubscribeInasistenciasDocente(inasistencias));
	}

	requestApiInasistenciasDocente(): Observable<IInasistencia[]> {
		this._loading$.next(true);
		const params = {
			limit: this.pageSize,
			offset: this._offset$.value,
			...this.objParams
		};

		const { id_persona } = this.authService.currentUserValue;
		return this.apiDocenteService.getDocenteByPkPersona(id_persona).pipe(
			concatMap((docente: IDocente) => this.apiInasistenciaService.getInasistenciasDocente(docente.id, params)),
			concatMap((response: IAlmacenInasistencia) => this.getInasistencias(response))
		);
	}
	
	getInasistencias(response: IAlmacenInasistencia): Observable<IInasistencia[]> {
		const { count, rows: inasistencias = [] } = response;
		this._collectionSize$.next(count);
		const _inasistencias = inasistencias.map((inasistencia: IInasistencia, index: number) => 
		({ index: this._offset$.value + index + 1, ...inasistencia }));
		return of(_inasistencias);
	}

	handleSubscribeInasistenciasDocente(inasistencias: IInasistencia[]): void {
		this._loading$.next(false);
		this._inasistencias$.next(inasistencias);
	}

	getMatriculaByIdCurso(planDocente: IPlanDocente, { fechaNotificacion }: any = {}): void {
		this.estudiantesPorCurso$ = this.apiMatriculaService.getMatriculaByIdCurso(planDocente.id_curso)
		.pipe(
			concatMap((matriculas: IMatricula[]) => {
				const arrayObs: Observable<any>[] = [];
				const _matriculas = matriculas.map((matricula: IMatricula) => {
					const params = {
						id_estudiante: matricula.estudiante.id,
						id_plan_docente: planDocente.id,
						fecha: fechaNotificacion
					};
					arrayObs.push(this.apiInasistenciaService.getInasistenciaByParams(params));
					return {
						fecha: fechaNotificacion,
						id_estudiante: matricula.estudiante.id,
						id_plan_docente: planDocente.id,
						estudiante: matricula.estudiante,
						plan_docente: planDocente,
						falta: false,
						justificado: false
					};
				});

				return forkJoin(arrayObs).pipe(
					map(data => {
						for (let i = 0; i < data.length; i++) {
							if (data[i].length > 0) {
								for (let j = 0; j < _matriculas.length; j++) {
									if (data[i][0].id_estudiante == _matriculas[j].id_estudiante) {
										_matriculas[j] = { ..._matriculas[j], falta: true, justificado: data[i][0].justificado };
									}
								}
							}
						}
						return _matriculas;
					})
				);
			})
		);
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaInasistenciasDocente(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getInasistenciasDocente();
	}

	createInasistencias(inasistencias: IInasistencia[], objParams: any): Observable<any> {
		return this.apiInasistenciaService.createInasistencias(inasistencias, objParams);
	}

	initStateInasistenciasDocente(): void {
		this.page = 1;
		this.pageSize = 10;
		this.objParams = {};
	}

}
