import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { IAnioLectivo, IEstadoAnioLectivo, IRango } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class AnioLectivoService {

	private _aniosLectivos$ = new BehaviorSubject<IAnioLectivo[]>([]);
	private _aniosLectivosVigentes$ = new BehaviorSubject<IAnioLectivo[]>([]);
	private _anioLectivo$ = new BehaviorSubject<IAnioLectivo>(null);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	aniosLectivos$: Observable<IAnioLectivo[]> = this._aniosLectivos$.asObservable();
	aniosLectivosVigentes$: Observable<IAnioLectivo[]> = this._aniosLectivosVigentes$.asObservable();
	anioLectivo$: Observable<IAnioLectivo> = this._anioLectivo$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	objParams: any = {};

	constructor(private apiAnioLectivoService: ApiAnioLectivoService) { }

	getAniosLectivos(): void {
		this._loading$.next(true);
		this.apiAnioLectivoService.getAniosLectivos(this.objParams)
		.subscribe((aniosLectivos: IAnioLectivo[]) => {
			this._loading$.next(false);
			this._aniosLectivos$.next(aniosLectivos);
		});
	}

	getAniosLectivosVigentes(): void {
		this._loading$.next(true);
		this.apiAnioLectivoService.getAniosLectivos(this.objParams)
		.subscribe((aniosLectivosVigentes: IAnioLectivo[]) => {
			this._loading$.next(false);
			this._aniosLectivosVigentes$.next(aniosLectivosVigentes);
		});
	}

	getAnioLectivoPorNumero(anio: number): Observable<IAnioLectivo> {
		return this.apiAnioLectivoService.getAnioLectivoPorNumero(anio);
	}
	
	getEstadosAniosLectivos(): Observable<IEstadoAnioLectivo[]> {
		return this.apiAnioLectivoService.getEstadosAniosLectivos();
	}

	getRangos(): Observable<IRango[]> {
		return this.apiAnioLectivoService.getRangos();
	}

	createAnioLectivo(anioLectivo: IAnioLectivo): Observable<boolean> {
		return this.apiAnioLectivoService.createAnioLectivo(anioLectivo).pipe(
			map((created: boolean) => {
				const message = created
				? 'Año lectivo guardado.'
				: 'Ya existe un año lectivo con esa descripción.';
				this.getAniosLectivos();
				this.setAnioLectivo(null);
				PopUp.success('Operación exitosa!', message);
				return created;
			})
		);
	}

	updateAnioLectivo(anioLectivo: IAnioLectivo): Observable<any> {
		return this.apiAnioLectivoService.updateAnioLectivo(this._anioLectivo$.value.id, anioLectivo).pipe(
			map((res: any) => {
				const message = res.updated
				? 'Año lectivo editado.'
				: 'Ya existe un año lectivo con esa información.';
				this.getAniosLectivos();
				this.setAnioLectivo(null);
				PopUp.success('Operación exitosa!', message)
				.then((result: SweetAlertResult) => {
					this.shouldCreate(true);
				});
				return res;
			})
		);
	}

	destroyAnioLectivo(idAnioLectivo: number): Observable<any> {
		return this.apiAnioLectivoService.destroyAnioLectivo(idAnioLectivo).pipe(
			map((res: any) => {
				const message = res.deleted
				? 'Año lectivo eliminado exitosamente.'
				: 'No se puede eliminar, año lectivo tiene registros asociados.';
				PopUp.success('Operación exitosa!', message);
				this.getAniosLectivos();
				return res;
			})
		);
	}

	initStateAnioLectivo(): void {
		this.setAnioLectivo(null);
		this._loading$.next(false);
		this.shouldCreate(true);
		this.objParams = {};
	}

	setAnioLectivo(anioLectivo: IAnioLectivo): void {
		this._anioLectivo$.next(anioLectivo);
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

}