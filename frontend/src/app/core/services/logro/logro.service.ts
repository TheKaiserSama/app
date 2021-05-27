import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiLogroService } from '@api/api-logro.service';
import { ILogro, IAlmacenLogro, IPlanDocente } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Injectable({
  	providedIn: 'root'
})
export class LogroService {

	private _storeLogros$ = new BehaviorSubject<ILogro[]>([]);
	private _listLogros$ = new BehaviorSubject<ILogro[]>([]);
	private _logro$ = new BehaviorSubject<ILogro>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
    private _openModalLogro$ = new BehaviorSubject<boolean>(false);
	storeLogros$: Observable<ILogro[]> = this._storeLogros$.asObservable();
	listLogros$: Observable<ILogro[]> = this._listLogros$.asObservable();
	logro$: Observable<ILogro> = this._logro$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	openModalLogros$: Observable<boolean> = this._openModalLogro$.asObservable();

	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;
	idPlanDocente: number;
	listLogros: ILogro[] = [];
	selectedCarAcad: IPlanDocente;
	porcentaje: number = 0;
	create: boolean = true;
	initListLogros: boolean = false;
	idLogrosToRemove: number[] = [];
	grado: number;
	periodo: number;
	anioLectivo: number = getCurrentYear();

	constructor(private apiLogroService: ApiLogroService) { }
	
	getLogroByPk(id: number): Observable<ILogro> {
		return this.apiLogroService.getLogroByPk(id);
	}

	getStoreLogros(): void {
		this.requestApiLogros().
		subscribe((logros: ILogro[]) => this.handleSubscribeLogros(logros));
	}

	requestApiLogros(): Observable<ILogro[]> {
		if (this.initListLogros) this.idPlanDocente = null;
		this._loading$.next(true);
		return this.apiLogroService.getLogros(this.pageSize, this._offset$.value, this.searchTerm, this.idPlanDocente, this.grado, this.periodo, this.anioLectivo)
		.pipe(
			map((logros: IAlmacenLogro) => {
				this._collectionSize$.next(logros.count);
				return logros.rows.map((logro: ILogro, index: number) =>
					({ index: this._offset$.value + index, ...logro }));
			})
		);
	}

	handleSubscribeLogros(logros: ILogro[]): void {
		this._loading$.next(false);
		this._storeLogros$.next(logros);
	}

	createLogros(): Observable<boolean> {
		return this.apiLogroService.createLogros(this.listLogros)
		.pipe(map((logros: ILogro[]) => {
			this.getStoreLogros();
			PopUp.success('Creados!', 'Logros guardados.')
			.then((result: SweetAlertResult) => {
				this.setOpenModalLogro(false);
			});
			return true;
		}));
	}

	updateLogros(): Observable<boolean> {
		return forkJoin([
			this.apiLogroService.updateLogros(this.listLogros),
			this.apiLogroService.destroyLogros(this.idLogrosToRemove)
		])
		.pipe(
			map((response: any) => {
				this.idLogrosToRemove = [];
				this.getStoreLogros();
				PopUp.success('Actualizado!', 'Logros actualizados.')
				.then((result: SweetAlertResult) => {
					this.setOpenModalLogro(false);
				});
				return true;
			})
		);

	}
	
	destroyLogros(): void {
		this.apiLogroService.destroyLogrosByPlanDocente(this.selectedCarAcad.id)
		.subscribe((affectedCount: number) => {
			if (affectedCount == 0) return;
			this.getStoreLogros();
			PopUp.success('Logros eliminados', 'Operación satisfactoria');
		});
	}

	initStateLogro(): void {
		this.initStateCloseModal();
		this.searchTerm = '';
		this.page = 1;
		this.pageSize = 10;
		this.idPlanDocente = null;
		this.initListLogros = false;
		this.anioLectivo = getCurrentYear();
	}

	initStateCloseModal(): void {
		this.setLogro(null);
		this.shouldCreate(true);
		this._listLogros$.next([]);
		this.setOpenModalLogro(false);
		this.porcentaje = 0;
		this.listLogros = [];
		this.idLogrosToRemove = [];
		this.create = true;
	}

	cleanLogros(): void {
		this.porcentaje = 0;
		this.listLogros = [];
		this.idLogrosToRemove = [];
		this.create = true;
		this.setLogro(null);
		this.shouldCreate(true);
		this._listLogros$.next([]);
	}

	resetLogros(): void {
		this._storeLogros$.next([]);
		this._collectionSize$.next(0);
	}

	addLogro(logro: ILogro): void {
		this.porcentaje += +logro.porcentaje;
		logro.index = this.listLogros.length;
		this.listLogros.push(logro);
		this._listLogros$.next(this.listLogros);
	}

	editLogro(logro: ILogro): void {
		const idx = this.listLogros.findIndex((itemLogro: ILogro) => itemLogro.index == logro.index);
		if (idx > -1) {
			this.porcentaje -= this.listLogros[idx].porcentaje;
			this.porcentaje += +logro.porcentaje;
			this.listLogros.splice(idx, 1, logro);
			this.shouldCreate(true);
			this.setLogro(null);
			this._listLogros$.next(this.listLogros);
		}
	}

	removeLogro(logro: ILogro): void {
		const idx = this.listLogros.findIndex((itemLogro: ILogro, pos: number) => itemLogro.index == logro.index);
		if (idx > -1) {
			this.porcentaje -= +logro.porcentaje;
			if (this.porcentaje < 0) this.porcentaje = 0;
			this.listLogros.splice(idx, 1);
			this.shouldCreate(true);
			this._listLogros$.next(this.listLogros);
			PopUp.success('Eliminado!', 'Operación satisfactoria.');
		}
	}

	addLogroToRemove(id: number): void {
		this.idLogrosToRemove.push(id);
	}

	addPorcentaje(logro: ILogro): number {
		return this.porcentaje + +logro.porcentaje;
	}

	subtractPorcentaje(logro: ILogro): number {
		return this.porcentaje - +logro.porcentaje;
	}

	newListLogros(): void {
		this.porcentaje = 100;
		this.listLogros = [ ...this._storeLogros$.value ];
		this._listLogros$.next(this.listLogros);
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaLogros(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getStoreLogros();
	}

	setStoreLogros(logros: ILogro[]): void {
		this._storeLogros$.next(logros);
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}
    
	setLogro(logro: ILogro): void {
		this._logro$.next(logro);
	}

    setOpenModalLogro(value: boolean): void {
		this._openModalLogro$.next(value);
    }
    
}