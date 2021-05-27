import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiCursoService } from '@api/api-curso.service';
import { IGrado } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';
import { getCurrentYear } from '@shared/helpers/transform';

@Injectable({
	providedIn: 'root'
})
export class GradoService {

	private _grados$ = new BehaviorSubject<IGrado[]>([]);
	private _gradosVigentes$ = new BehaviorSubject<IGrado[]>([]);
	private _grado$ = new BehaviorSubject<IGrado>(null);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	grados$: Observable<IGrado[]> = this._grados$.asObservable();
	gradosVigentes$: Observable<IGrado[]> = this._gradosVigentes$.asObservable();
	grado$: Observable<IGrado> = this._grado$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	objParams: any = {};

	constructor(private apiCursoService: ApiCursoService) { }

	getGrados(): void {
		this._loading$.next(true);
		this.apiCursoService.getGrados(this.objParams)
		.subscribe((grados: IGrado[]) => {
			this._loading$.next(false);
			this._grados$.next(grados);
		});
	}

	getGradosVigentes(): void {
		this._loading$.next(true);
		this.apiCursoService.getGrados(this.objParams)
		.subscribe((gradosVigentes: IGrado[]) => {
			this._loading$.next(false);
			this._gradosVigentes$.next(gradosVigentes);
		});
	}
	
	getGradoPorAnio(anio: number = getCurrentYear()): Observable<IGrado[]> {
		return this.apiCursoService.getGradosPorAnio(anio);
	}

	createGrado(grado: IGrado): Observable<boolean> {
		return this.apiCursoService.createGrado(grado).pipe(
			map((created: boolean) => {
				const message = created
				? 'Grado guardado.'
				: 'Ya existe un grado con esa descripción.';
				this.getGrados();
				this.setGrado(null);
				PopUp.success('Operación exitosa!', message);
				return created;
			})
		);
	}

	updateGrado(grado: IGrado): Observable<any> {
		return this.apiCursoService.updateGrado(this._grado$.value.id, grado).pipe(
			map((res: any) => {
				const message = res.updated
				? 'Grado editado.'
				: 'Ya existe un grado con esa descripción.';
				this.getGrados();
				this.setGrado(null);
				PopUp.success('Operación exitosa!', message)
				.then((result: SweetAlertResult) => {
					this.shouldCreate(true);
				});
				return res;
			})
		);
	}

	destroyGrado(idGrado: number): Observable<any> {
		return this.apiCursoService.destroyGrado(idGrado).pipe(
			map((res: any) => {
				const message = res.deleted
				? 'Grado eliminado exitosamente.'
				: 'No se puede eliminar, grado asociado a cursos.';
				PopUp.success('Operación exitosa!', message);
				this.getGrados();
				return res;
			})
		);
	}

	setGrado(grado: IGrado): void {
		this._grado$.next(grado);
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	initStateGrado(): void {
		this.setGrado(null);
		this._loading$.next(false);
		this.shouldCreate(true);
		this.objParams = {};
	}

}