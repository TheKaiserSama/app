import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

import { ApiActividadService } from '@api/api-actividad.service';
import { ApiEstudianteService } from '@api/api-estudiante.service';
import { ApiMatriculaService } from '@api/api-matricula.service';
import { ApiNotaService } from '@api/api-nota.service';
import { ApiPlanDocenteService } from '@api/api-plan-docente.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { ILogro, IActividad, IEstudiante, IMatricula, INotaActividad } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class NotaEstudianteService {

	private _loading$ = new BehaviorSubject<boolean>(false);
	private _actividades$ = new BehaviorSubject<any>([]);
	loading$: Observable<boolean> = this._loading$.asObservable();
	actividades$: Observable<any> = this._actividades$.asObservable();
	logros$: Observable<ILogro[]>;
	idPersona: number;
	numeroPeriodo: number = 1;
	objParams: any = {};

	constructor(
		private apiActividadService: ApiActividadService,
		private apiEstudianteService: ApiEstudianteService,
		private apiMatriculaService: ApiMatriculaService,
		private apiNotaService: ApiNotaService,
		private apiPlanDocenteService: ApiPlanDocenteService,
		private authService: AuthenticationService,
	) {
		const token = this.authService.getItemLocalStorage('token');
		const decodedToken = this.authService.decodeToken(token);
		this.idPersona = decodedToken['persona']['id'];
	}

	getNotaDefinitivaPorMateria(id_curso: number, params: any): Observable<any> {
		params.id_persona = this.idPersona;
		return this.apiPlanDocenteService.getPlanDocentePorCurso(id_curso, params);
	}

	getMatriculasPorEstudiante(): Observable<IMatricula[]> {
		return this.apiEstudianteService.getEstudianteByPkPersona(this.idPersona)
		.pipe(
			concatMap((estudiante: IEstudiante) => {
				if (!estudiante) return of([]);
				return this.apiMatriculaService.getMatriculasByIdEstudiante(estudiante.id);
			})
		);
	}

	getActividadesPorLogro(idLogro: number): void {
		this._actividades$.next([]);
		this.apiActividadService.getActividadesPorLogro(idLogro)
		.pipe(
			concatMap((actividades: IActividad[]) => {
				if (!actividades) return of([]); // return actividades;
				const arrayObs = actividades.map((actividad: IActividad) => 
					this.apiNotaService.getOneEstudianteActividad(this.objParams.idEstudiante, actividad.id)
					.pipe(
						map((notaActividad: INotaActividad) => {
							let _actividad: IActividad = {};
							if (notaActividad && notaActividad.nota) _actividad = { ...actividad, nota: notaActividad.nota };
							else _actividad = actividad;
							
							return _actividad;
						})
					)
				);
				return forkJoin(arrayObs);				
			}),
			take(1)
		)
		.subscribe((actividades: any) => {
			if (!actividades) return;
			this._actividades$.next(actividades);
		});
	}

}