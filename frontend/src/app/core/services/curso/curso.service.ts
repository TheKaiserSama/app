import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiCursoService } from '@api/api-curso.service';
import { ICurso, IAlmacenCurso, IGrado } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class CursoService {

	private _cursos$ = new BehaviorSubject<ICurso[]>([]);
	private _curso$ = new BehaviorSubject<ICurso>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _closeFormCurso$ = new BehaviorSubject<boolean>(false);
	cursos$: Observable<ICurso[]> = this._cursos$.asObservable();
	curso$: Observable<ICurso> = this._curso$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	closeFormCurso$: Observable<boolean> = this._closeFormCurso$.asObservable();
	page: number = 1;
	pageSize: number = 10;
	curso: ICurso; // Revisar luego
	objParams: any = {};
	
	constructor(private apiCursoService: ApiCursoService) { }

	getCursos(): void {
		this._loading$.next(true);
		this.apiCursoService.getCursos(this.pageSize, this._offset$.value, this.objParams)
		.pipe(
			map((cursos: IAlmacenCurso) => {
				this._collectionSize$.next(cursos.count);
				return cursos.rows.map((curso: ICurso, index: number) =>
					({ index: this._offset$.value + index + 1, ...curso }));
			})
		)
		.subscribe((cursos: ICurso[]) => {
			this._loading$.next(false);
			this._cursos$.next(cursos);
		});
	}

	getCursosPorSede(objParams?: any): Observable<IGrado[]> {
		const { id_sede, id_anio_lectivo } = objParams;
		if (id_sede && id_anio_lectivo) {
			const curso: ICurso = { id_sede, id_anio_lectivo };
			return this.apiCursoService.getCursosPorSede(curso);
		}
		return of([]);
	}

	getCursosPorSedeAnioLectivo(objParams?: any): Observable<ICurso[]> {
		const { id_sede, id_anio_lectivo } = objParams;
		if (id_sede && id_anio_lectivo) {
			const curso: ICurso = { id_sede, id_anio_lectivo };
			return this.apiCursoService.getCursosPorSedeAnioLectivo(curso);
		}
		return of([]);
	}

	createCurso(curso: ICurso): void {
		this.apiCursoService.createCurso(curso)
		.subscribe((created: boolean) => {
			const message = created
			? 'Curso registrado exitosamente.'
			: 'Curso duplicado, no se pudo efectuar la operación.';
			this.getCursos();
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._closeFormCurso$.next(true);
			});
		});
	}

	updateCurso(curso: ICurso): void {
		const dataCurso = { ...this.curso, ...curso };
		this.apiCursoService.upadteCurso(dataCurso.id, dataCurso)
		.subscribe((data: any) => {
			const message = data.updated
			? 'Curso actualizado exitosamente.'
			: 'No se puede actualizar, Existe otro curso con la información suministrada.';
			this.getCursos();
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._closeFormCurso$.next(true);
			});
		});
	}

	destroyCurso(idCurso: number): void {
		PopUp.warning('Estas seguro?', 'El curso se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiCursoService.destroyCurso(idCurso)
			.subscribe((res: any) => {
				const message = res > 0
				? 'Curso eliminado exitosamente.'
				: 'No elimino ningun curso.';
				PopUp.success('Operación exitosa!', message);
				this.getCursos();
			});
		});
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaCursos(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getCursos();
	}

	setCurso(curso: ICurso): void {
		this._curso$.next(curso);
	}

	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	initStateCurso(): void {
		this.initStateCloseModal();
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.page = 1;
		this.pageSize = 10;
	}

	initStateCloseModal(): void {
		this.setCurso(null);
		this.shouldCreate(true);
		this._closeFormCurso$.next(false);
	}

}
