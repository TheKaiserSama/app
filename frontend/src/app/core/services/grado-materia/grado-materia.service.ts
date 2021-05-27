import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiCursoService } from '@api/api-curso.service';
import { IGradoMateria, IAlmacenGradoMateria } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class GradoMateriaService {

	private _gradosMaterias$ = new BehaviorSubject<IGradoMateria[]>([]);
	private _gradoMateria$ = new BehaviorSubject<IGradoMateria>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	gradosMaterias$: Observable<IGradoMateria[]> = this._gradosMaterias$.asObservable();
	gradoMateria$: Observable<IGradoMateria> = this._gradoMateria$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	page: number = 1;
	pageSize: number = 10;
	objParams: any = {};

	constructor(private apiCursoService: ApiCursoService) { }

	getGradosMaterias(): void {
		this.requestApiGradoMateria().subscribe((gradosMaterias: IGradoMateria[]) =>
		this.handleSubscribeGradoMateria(gradosMaterias));
	}

	requestApiGradoMateria(): Observable<IGradoMateria[]> {
		this._loading$.next(true);
		return this.apiCursoService.getGradosMaterias(this.pageSize, this._offset$.value, this.objParams).pipe(
			map((gradosMaterias: IAlmacenGradoMateria) => {
				this._collectionSize$.next(gradosMaterias.count);
				return gradosMaterias.rows.map((gradoMateria: IGradoMateria, index: number) =>
					({ index: this._offset$.value + index + 1, ...gradoMateria }));
			})
		);
	}

	handleSubscribeGradoMateria(gradosMaterias: IGradoMateria[]): void {
		this._loading$.next(false);
		this._gradosMaterias$.next(gradosMaterias);
	}

	getGradosMateriasParams(idAnioLectivo: number, idGrado: number): Observable<IGradoMateria[]> {
		return this.apiCursoService.getGradosMateriasParams(idAnioLectivo, idGrado);
	}

	createGradoMateria(gradoMateria: IGradoMateria): Observable<boolean> {
		return this.apiCursoService.createGradoMateria(gradoMateria).pipe(
			map((created: boolean) => {
				const message = created
				? 'Registro creado.'
				: 'Ya existe un registro con la información suministrada.';
				this.getGradosMaterias();
				this.setGradoMateria(null);
				PopUp.success('Operacion exitosa', message);
				return created;
			})
		)
	}

	updateGradoMateria(gradoMateria: IGradoMateria): Observable<any> {
		return this.apiCursoService.updateGradoMateria(this._gradoMateria$.value.id, gradoMateria).pipe(
			map((res: any) => {
				const message = res.updated
				? 'Registro editado.'
				: 'Ya existe un registro con la información suministrada.';
				this.getGradosMaterias();
				this.setGradoMateria(null);
				PopUp.success('Operación exitosa!', message)
				.then((result: SweetAlertResult) => {
					this.shouldCreate(true);
				});
				return res;
			})
		);
	}

	destroyGradoMateria(idGradoMateria: number): Observable<any> {
		return this.apiCursoService.destroyGradoMateria(idGradoMateria).pipe(
			map((res: any) => {
				const message = res > 0 
				? 'Registro eliminado exitosamente.'
				: 'No se puede eliminar, regitro referenciado.';
				PopUp.success('Operación exitosa!', message);
				this.getGradosMaterias();
				return res;
			})
		);
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaGradoMateria(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getGradosMaterias();
	}

	setGradoMateria(gradoMateria: IGradoMateria): void {
		this._gradoMateria$.next(gradoMateria);
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	initStateGradoMateria(): void {
		this._gradosMaterias$.next([]);
		this.setGradoMateria(null);
		this._loading$.next(false);
		this.shouldCreate(true);
		this.page = 1;
		this.pageSize = 10;
		this.objParams = {};
	}

}
// 140