import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map } from "rxjs/operators";
import { SweetAlertResult } from 'sweetalert2';

import { ApiActividadService } from '@api/api-actividad.service';
import { IActividad, IAlmacenActividad, ILogro } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class ActividadService {

	private _storeActividades$ = new BehaviorSubject<IActividad[]>([]);
	private _listActividades$ = new BehaviorSubject<IActividad[]>([]);
	private _actividad$ = new BehaviorSubject<IActividad>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
    private _openModalActividad$ = new BehaviorSubject<boolean>(false);
	storeActividades$: Observable<IActividad[]> = this._storeActividades$.asObservable();
	listActividades$: Observable<IActividad[]> = this._listActividades$.asObservable();
	actividad$: Observable<IActividad> = this._actividad$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	openModalActividad$: Observable<boolean> = this._openModalActividad$.asObservable();

	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;
	idLogro: number;
	listActividades: IActividad[] = [];
	selectedLogro: ILogro;
	porcentaje: number = 0;
	create: boolean = true;
	idActividadesToRemove: number[] = [];

	constructor(private apiActividadService: ApiActividadService) { }

	getStoreActividades(): void {
		this.requestApiActividades()
		.subscribe((actividades: IActividad[]) => this.handleSubscribeActividades(actividades));
	}

	requestApiActividades(): Observable<IActividad[]> {
		this._loading$.next(true);
		return this.apiActividadService.getActividades(this.pageSize, this._offset$.value, this.searchTerm, this.idLogro)
		.pipe(
			map((actividades: IAlmacenActividad) => {
				this._collectionSize$.next(actividades.count);
				return actividades.rows.map((actividad: IActividad, index: number) =>
					({ index: this._offset$.value + index, ...actividad }));
			})
		);
	}

	handleSubscribeActividades(actividades: IActividad[]): void {
		this._loading$.next(false);
		this._storeActividades$.next(actividades);
	}

	createActividades(): Observable<boolean> {
		return this.apiActividadService.createActividades(this.listActividades)
		.pipe(map((actividades: IActividad[]) => {
			this.getStoreActividades();
			PopUp.success('Creadas!', 'Actividades guardadas.')
			.then((result: SweetAlertResult) => {
				this.setOpenModalActividad(false);
			});
			return true;
		}));
	}

	updateActividades(): Observable<boolean> {
		return forkJoin([
			this.apiActividadService.updateActividades(this.listActividades),
			this.apiActividadService.destroyActividades(this.idActividadesToRemove)
		])
		.pipe(
			map((response: any) => {
				this.idActividadesToRemove = [];
				this.getStoreActividades();
				PopUp.success('Actualizadas!', 'Actividades actualizadas.')
				.then((result: SweetAlertResult) => {
					this.setOpenModalActividad(false);
				});
				return true;
			})
		);
	}

	destroyActividades(): void {
		this.apiActividadService.destroyActividadesByIdLogro(this.selectedLogro.id)
		.subscribe((affectedRows: number) => {
			if (affectedRows == 0) return;
			this.getStoreActividades();
			PopUp.success('Actividades eliminadas', 'Operación satisfactoria');
		});
	}

	addActividad(actividad: IActividad): void {
		this.porcentaje += +actividad.porcentaje;
		actividad.index = this.listActividades.length;
		this.listActividades.push(actividad);
		this._listActividades$.next(this.listActividades);
	}

	editActividad(actividad: IActividad): void {
		const idx = this.listActividades.findIndex((itemActividad: IActividad) => itemActividad.index == actividad.index);
		if (idx > -1) {
			this.porcentaje -= this.listActividades[idx].porcentaje;
			this.porcentaje += +actividad.porcentaje;
			this.listActividades.splice(idx, 1, actividad);
			this.shouldCreate(true);
			this.setActividad(null);
			this.setListActividades(this.listActividades);
		}
	}

	removeActividad(actividad: IActividad): void {
		const idx = this.listActividades.findIndex((itemActividad: IActividad, pos: number) => itemActividad.index == actividad.index);
		if (idx > -1) {
			this.porcentaje -= +actividad.porcentaje;
			if (this.porcentaje < 0) this.porcentaje = 0;
			this.listActividades.splice(idx, 1);
			this.shouldCreate(true);
			this.setListActividades(this.listActividades);
			PopUp.success('Eliminada!', 'Actividad eliminada.');
		}
	}

	addActividadToRemove(id: number): void {
		this.idActividadesToRemove.push(id);
	}

	cleanActividades(): void {
		this.porcentaje = 0;
		this.listActividades = [];
		this.idActividadesToRemove = [];
		this.create = true;
		this.shouldCreate(true);
		this.setListActividades([]);
	}

	resetActividades(): void {
		this._storeActividades$.next([]);
		this._collectionSize$.next(0);
	}

	addPorcentaje(logro: ILogro): number {
		return this.porcentaje + +logro.porcentaje;
	}

	subtractPorcentaje(logro: ILogro): number {
		return this.porcentaje - +logro.porcentaje;
	}

	newListActividades(): void {
		this.porcentaje = 100;
		this.listActividades = [ ...this._storeActividades$.value ];
		this.setListActividades(this.listActividades);
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaActividades(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getStoreActividades();
	}

	setListActividades(actividades: IActividad[]): void {
		this._listActividades$.next(actividades);
	}

	setActividad(actividad: IActividad): void {
		this._actividad$.next(actividad);
	}

	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}
    
    setOpenModalActividad(value: boolean): void {
		this._openModalActividad$.next(value);
	}
	
}