import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { ApiEstudianteService } from '@api/api-estudiante.service';
import { ApiInasistenciaService } from '@api/api-inasistencia.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { IAlmacenInasistencia, IEstudiante, IInasistencia } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class InasistenciaEstudianteService {

	private _inasistencias$ = new BehaviorSubject<IInasistencia[]>([]);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	inasistencias$: Observable<IInasistencia[]> = this._inasistencias$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	page: number = 1;
	pageSize: number = 10;
	objParams: any = {};
	
	constructor(
		private apiEstudianteService: ApiEstudianteService,
		private apiInasistenciaService: ApiInasistenciaService,
		private authService: AuthenticationService,
	) { }

	getInasistenciasEstudiante(): void {
		this._loading$.next(true);
		const params = {
			limit: this.pageSize,
			offset: this._offset$.value,
			...this.objParams
		};
		const { id_persona } = this.authService.currentUserValue;
		this.apiEstudianteService.getEstudianteByPkPersona(id_persona)
		.pipe(
			concatMap((estudiante: IEstudiante) => this.apiInasistenciaService.getInasistenciasEstudiante(estudiante.id, params)),
			concatMap((response: IAlmacenInasistencia) => this.getInasistencias(response))
		)
		.subscribe((inasistencias: IInasistencia[]) => {
			this._loading$.next(false);
			this._inasistencias$.next(inasistencias);
		});
	}
	
	getInasistencias(response: IAlmacenInasistencia): Observable<IInasistencia[]> {
		const { count, rows: inasistencias = [] } = response;
		this._collectionSize$.next(count);
		const _inasistencias = inasistencias.map((inasistencia: IInasistencia, index: number) => 
		({ index: this._offset$.value + index + 1, ...inasistencia }));
		return of(_inasistencias);
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaInasistenciasEstudiante(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getInasistenciasEstudiante();
	}

	initStateInasistenciasEstudiante(): void {
		this.page = 1;
		this.pageSize = 10;
		this.objParams = {};
	}

}
