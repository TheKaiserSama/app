import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { ApiValoracionFormativaService } from '@api/api-valoracion-formativa.service';
import { IValoracionFormativa } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class ValoracionFormativaService {

	private _valoracionesFormativas$ = new BehaviorSubject<IValoracionFormativa[]>([]);
	private _valoracionFormativa$ = new BehaviorSubject<IValoracionFormativa>(null);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _loading$ = new BehaviorSubject<boolean>(false);
	valoracionesFormativas$: Observable<IValoracionFormativa[]> = this._valoracionesFormativas$.asObservable();
	valoracionFormativa$: Observable<IValoracionFormativa> = this._valoracionFormativa$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();

	constructor(private apiValoracionFormativaService: ApiValoracionFormativaService) { }

	getValoracionesFormativas(params: any = {}): void {
		this._loading$.next(true);
		this.apiValoracionFormativaService.getValoracionesFormativas(params)
		.subscribe((valoracionesFormativas: IValoracionFormativa[]) => {
			this._loading$.next(false);
			this._valoracionesFormativas$.next(valoracionesFormativas);
		});
	}

	createValoracionFormativa(valoracionFormativa: IValoracionFormativa): Observable<boolean> {
		return this.apiValoracionFormativaService.createValoracionFormativa(valoracionFormativa)
		.pipe(
			concatMap(({ created }) => {
				const message = created ? 'Valoración formativa guardada.' : 'No se pudo guardar el registro.';
				this.getValoracionesFormativas();
				this.setValoracionFormativa(null);
				PopUp.success('Operación realizada', message);
				return of(created);
			})
		);
	}

	updateValoracionFormativa(id: number, valoracionFormativa: IValoracionFormativa): Observable<boolean> {
		return this.apiValoracionFormativaService.updateValoracionFormativa(id, valoracionFormativa)
		.pipe(
			concatMap(({ affectedRowsCount }) => {
				const message = (affectedRowsCount > 0)
				? 'Valoración formativa editada.'
				: 'No se pudo actualizar la valoración formativa.';
				this.getValoracionesFormativas();
				this.setValoracionFormativa(null);
				PopUp.success('Operación realizada', message);
				this.shouldCreate(true);
				return of(true);
			})
		) || of(false);
	}

	destroyValoracionFormativa(id: number): Observable<any> {
		return this.apiValoracionFormativaService.destroyValoracionFormativa(id)
		.pipe(
			map(({ affectedRowsCount }) => {
				const message = (affectedRowsCount > 0)
				? 'Valoración formativa eliminada exitosamente.'
				: 'No se pudo actualizar la valoración formativa.';
				PopUp.success('Operación realizada', message);
				this.getValoracionesFormativas();
				return affectedRowsCount;
			})
		);
	}

	setValoracionFormativa(valoracionFormativa: IValoracionFormativa): void {
		this._valoracionFormativa$.next(valoracionFormativa);
	}

	shouldCreate(state: boolean): void {
		this._shouldCreate$.next(state);
	}

}
