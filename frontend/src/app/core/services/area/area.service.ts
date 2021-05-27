import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiAreaService } from '@api/api-area.service';
import { MateriaService } from '@services/materia/materia.service';
import { IArea, IAlmacenArea } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class AreaService {

	private _areas$ = new BehaviorSubject<IArea[]>([]);
	private _area$ = new BehaviorSubject<IArea>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	areas$: Observable<IArea[]> = this._areas$.asObservable();
	area$: Observable<IArea> = this._area$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;

	constructor(
		private apiAreaService: ApiAreaService,
		private materiaService: MateriaService
	) { }

	getAreaByPk(id: number): Observable<IArea> {
		return this.apiAreaService.getAreaByPk(id);
	}

	getAreas(): Observable<IArea[]> {
		return this.apiAreaService.getAreas();
	}

	getAreasPaginacion(): void {
		this.requestApiAreas()
		.pipe(take(1))
		.subscribe((areas: IArea[]) => this.handleSubscribeAreas(areas));
	}

	requestApiAreas(): Observable<IArea[]> {
		this._loading$.next(true);
		return this.apiAreaService.getAreasPaginacion(this.pageSize, this._offset$.value, this.searchTerm)
		.pipe(
			map((areas: IAlmacenArea) => {
				this._collectionSize$.next(areas.count);
				return areas.rows.map((area: IArea, index: number) =>
					({ index: this._offset$.value + index + 1, ...area }));
			})
		);
	}

	handleSubscribeAreas(areas: IArea[]): void {
		this._loading$.next(false);
		this._areas$.next(areas);
	}

	createArea(area: IArea): Observable<boolean> {
		return this.apiAreaService.createArea(area).pipe(
			map((created: boolean) => {
				const message = created
				? 'Área guardada.'
				: 'Área duplicada, no se puede efectuar la operación.';
				this.getAreasPaginacion();
				this.setArea(null);
				PopUp.success('Operación exitosa!', message);
				return created;
			})
		);
	}

	updateArea(area: IArea): Observable<any> {
		return this.apiAreaService.updateArea(this._area$.value.id, area).pipe(
			map((res: any) => {
				const message = res.updated
				? 'Área actualizada exitosamente.'
				: 'No se puede actualizar, Existe otra área con la información suministrada.';
				this.getAreasPaginacion();
				this.setArea(null);
				this.materiaService.getMaterias();
				PopUp.success('Operación exitosa!', message)
				.then((result: SweetAlertResult) => {
					this.shouldCreate(true);
				});
				return res;
			})
		);
	}

	destroyArea(idArea: number): Observable<any> {
		return this.apiAreaService.destroyArea(idArea).pipe(
			map((res: any) => {
				const message = res.deleted
				? 'Área eliminada exitosamente.'
				: 'No se puede eliminar, tiene materias asociadas.';			
				PopUp.success('Operación exitosa!', message);
				this.getAreasPaginacion();
				return res;
			})
		);
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaAreas(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getAreasPaginacion();
	}

	setArea(area: IArea): void {
		this._area$.next(area);
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	initStateArea(): void {
		this._areas$.next([]);
		this.setArea(null);
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.shouldCreate(true);
		this.searchTerm = '';
		this.page = 1;
		this.pageSize = 10;
	}

}