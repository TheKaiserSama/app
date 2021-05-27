import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiPeriodoService } from '@api/api-periodo.service';
import { IPeriodo, IAlmacenPeriodo } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class PeriodoService {

	private _periodos$ = new BehaviorSubject<IPeriodo[]>([]);
	private _periodo$ = new BehaviorSubject<IPeriodo>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _shouldCloseFormPeriodo$ = new BehaviorSubject<boolean>(false);
	periodos$: Observable<IPeriodo[]> = this._periodos$.asObservable();
	periodo$: Observable<IPeriodo> = this._periodo$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	shouldCloseFormPeriodo$: Observable<boolean> = this._shouldCloseFormPeriodo$.asObservable();
	page: number = 1;
	pageSize: number = 10;
	anioLectivo: number;
	periodo: IPeriodo;
	
	constructor(private apiPeriodoService: ApiPeriodoService) { }

	getPeriodos(): void {
		this._loading$.next(true);
		this.apiPeriodoService.getPeriodos(this.pageSize, this._offset$.value, this.anioLectivo)
		.pipe(
			map((periodos: IAlmacenPeriodo) => {
				this._collectionSize$.next(periodos.count);
				return periodos.rows.map((periodo: IPeriodo, index: number) =>
					({ index: this._offset$.value + index + 1, ...periodo }));
			})
		)
		.subscribe((periodos: IPeriodo[]) => {
			this._loading$.next(false);
			this._periodos$.next(periodos);	
		});
	}

	getPeriodosPorAnioLectivo(idAnioLectivo: number): Observable<IPeriodo[]> {
		return this.apiPeriodoService.getPeriodosPorAnioLectivo(idAnioLectivo);
	}

	createPeriodo(periodo: IPeriodo): void {
		this.apiPeriodoService.createPeriodo(periodo)
		.subscribe((created: boolean) => {
			const message = created
			? 'Periodo registrado exitosamente.'
			: 'Periodo duplicado, no se pudo efectuar la operación.';
			this.getPeriodos();
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._shouldCloseFormPeriodo$.next(true);
			});
		});
	}

	updatePeriodo(periodo: IPeriodo): void {
		const dataPeriodo = { ...this.periodo, ...periodo };
		this.apiPeriodoService.updatePeriodo(dataPeriodo.id, dataPeriodo)
		.subscribe((data: any) => {
			const message = data.updated
			? 'Periodo actualizado exitosamente.'
			: 'No se puede actualizar, Existe otro periodo con la información suministrada.';
			this.getPeriodos();
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._shouldCloseFormPeriodo$.next(true);
			});
		});
	}

	destroyPeriodo(idPeriodo: number): void {
		PopUp.warning('Estas seguro?', 'El periodo se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiPeriodoService.destroyPeriodo(idPeriodo)
			.subscribe((res: any) => {
				const message = +res > 0
				? 'Periodo eliminado exitosamente.'
				: 'No se puede eliminar, periodo asociado a plan docente.';
				PopUp.success('Operación exitosa!', message);
				this.getPeriodos();
			});
		});
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaPeriodos(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getPeriodos();
	}

	setPeriodo(periodo: IPeriodo): void {
		this._periodo$.next(periodo);
	}

	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	initStatePeriodo(): void {
		this.initStateCloseModal();
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.page = 1;
		this.pageSize = 10;
		this.anioLectivo = null;
	}

	initStateCloseModal(): void {
		this.setPeriodo(null);
		this.shouldCreate(true);
		this._shouldCloseFormPeriodo$.next(false);
	}
	
}
