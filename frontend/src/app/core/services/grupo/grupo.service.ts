import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiCursoService } from '@api/api-curso.service';
import { IGrupo, IGrado, ICurso } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class GrupoService {

	private _grupos$ = new BehaviorSubject<IGrupo[]>([]);
	private _gruposVigentes$ = new BehaviorSubject<IGrupo[]>([]);
	private _grupo$ = new BehaviorSubject<IGrado>(null);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	grupos$: Observable<IGrado[]> = this._grupos$.asObservable();
	gruposVigentes$: Observable<IGrado[]> = this._gruposVigentes$.asObservable();
	grupo$: Observable<IGrado> = this._grupo$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	idAnioLectivo: number;
	objParams: any = {};

	constructor(private apiCursoService: ApiCursoService) { }

	getGrupos(): void {
		this._loading$.next(true);
		this.apiCursoService.getGrupos(this.objParams)
		.subscribe((grupos: IGrupo[]) => {
			this._loading$.next(false);
			this._grupos$.next(grupos);
		});
	}

	getGruposVigentes(): void {
		this._loading$.next(true);
		this.apiCursoService.getGrupos(this.objParams)
		.subscribe((gruposVigentes: IGrupo[]) => {
			this._loading$.next(false);
			this._gruposVigentes$.next(gruposVigentes);
		});
	}

	getGruposPorGrado(objParams: any): Observable<ICurso[]> {
		const { id_sede, id_anio_lectivo, id_grado } = objParams;
		const params: any = {};
		if (id_sede) params.id_sede = id_sede;
		if (id_anio_lectivo) params.id_anio_lectivo = id_anio_lectivo;
		if (id_grado) params.id_grado = id_grado;
		return this.apiCursoService.getGruposPorGrado(params);
	}

	createGrupo(grupo: IGrupo): Observable<boolean> {
		return this.apiCursoService.createGrupo(grupo).pipe(
			map((created: boolean) => {
				const message = created
				? 'Grupo guardado.'
				: 'Ya existe un grupo con esa descripción.';
				this.getGrupos();
				this.setGrupo(null);
				PopUp.success('Operación exitosa!', message);
				return created;
			})
		);
	}

	updateGrupo(grupo: IGrupo): Observable<any> {
		return this.apiCursoService.updateGrupo(this._grupo$.value.id, grupo).pipe(
			map((res: any) => {
				const message = res.updated
				? 'Grupo editado.'
				: 'Ya existe un grupo con esa descripción.';
				this.getGrupos();
				this.setGrupo(null);
				PopUp.success('Operación exitosa!', message)
				.then((result: SweetAlertResult) => {
					this.shouldCreate(true);
				});
				return res;
			})
		);
	}

	destroyGrupo(idGrupo: number): Observable<any> {
		return this.apiCursoService.destroyGrupo(idGrupo).pipe(
			map((res: any) => {
				const message = res.deleted
				? 'Grupo eliminado exitosamente.'
				: 'No se puede eliminar, grupo asociado a cursos.';
				PopUp.success('Operación exitosa!', message);
				this.getGrupos();
				return res;
			})
		);
	}

	setGrupo(grupo: IGrupo): void {
		this._grupo$.next(grupo);
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	initStateGrupo(): void {
		this.setGrupo(null);
		this._loading$.next(false);
		this.shouldCreate(true);
		this.objParams = {};
	}

}
