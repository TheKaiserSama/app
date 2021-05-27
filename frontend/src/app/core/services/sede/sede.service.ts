import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiInstitucionService } from '@api/api-institucion.service';
import { ISede } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class SedeService {

	private _sedes$ = new BehaviorSubject<ISede[]>([]);
	private _sede$ = new BehaviorSubject<ISede>(null);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _createSede$ = new BehaviorSubject<boolean>(true);
	sedes$: Observable<ISede[]> = this._sedes$.asObservable();
	sede$: Observable<ISede> = this._sede$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	createSede$: Observable<boolean> = this._createSede$.asObservable();

	constructor(private apiInstitucionService: ApiInstitucionService) { }

	getSedes(): void {
		this.apiInstitucionService.getSedes()
		.subscribe((sedes: ISede[]) => this._sedes$.next(sedes));
	}

	createSede(sede: ISede): Observable<boolean> {
		return this.apiInstitucionService.createSede(sede)
		.pipe(
			map((created: boolean) => {
				const message = created ?
				'Sede guardada.'
				: 'Ya existe una sede con la información suministrada.';
				this.getSedes();
				this.setSede(null);
				PopUp.success('Operación exitosa', message);
				return created;
			})
		);
	}

	updateSede(sede: ISede): Observable<any> {
		return this.apiInstitucionService.updateSede(this._sede$.value.id, sede)
		.pipe(
			map((res: any) => {
				const message = res.updated
				? 'Sede editada.'
				: 'Ya existe una sede con esa nombre.';
				this.getSedes();
				this.setSede(null);
				PopUp.success('Operación exitosa!', message);
				this.shouldCreate(true);
				return res;
			})
		);
	}

	destroySede(idSede: number): Observable<any> {
		return this.apiInstitucionService.destroySede(idSede)
		.pipe(
			map((res: any) => {
				const message = res.deleted
				? 'Sede eliminada exitosamente.'
				: 'No se puede eliminar, sede asociada a cursos.';
				PopUp.success('Operación exitosa!', message);
				this.getSedes();
				return res;
			})
		);
	}

	setSede(sede: ISede): void {
		this._sede$.next(sede);
	}
	
	shouldCreate(value: boolean): void {
		this._createSede$.next(value);
	}

	initStateSede(): void {
		this.setSede(null);
		this.shouldCreate(true);
	}

}