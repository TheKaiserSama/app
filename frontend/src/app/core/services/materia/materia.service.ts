import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiMateriaService } from '@api/api-materia.service';
import { IMateria, IAlmacenMateria } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class MateriaService {

	private _materias$ = new BehaviorSubject<IMateria[]>([]);
	private _materia$ = new BehaviorSubject<IMateria>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _shouldCloseFormMateria$ = new BehaviorSubject<boolean>(false);
	materias$: Observable<IMateria[]> = this._materias$.asObservable();
	materia$: Observable<IMateria> = this._materia$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	shouldCloseFormMateria$: Observable<boolean> = this._shouldCloseFormMateria$.asObservable();
	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;

	constructor(private apiMateriaService: ApiMateriaService) { }

	getMateriasByArea(id: number): Observable<IMateria[]> {
		return this.apiMateriaService.getMateriasByPkArea(id);
	}

	getMaterias(): void {
		this.requestApiMaterias().subscribe((materias: IMateria[]) => 
		this.handleSubscribeMaterias(materias));
	}

	requestApiMaterias(): Observable<IMateria[]> {
		this._loading$.next(true);
		return this.apiMateriaService.getMaterias(this.pageSize, this._offset$.value, this.searchTerm)
		.pipe(
			map((materias: IAlmacenMateria) => {
				this._collectionSize$.next(materias.count);
				return materias.rows.map((materia: IMateria, index: number) =>
					({ index: this._offset$.value + index + 1, ...materia }));
			})
		);
	}

	handleSubscribeMaterias(materias: IMateria[]): void {
		this._loading$.next(false);
		this._materias$.next(materias);
	}

	createMateria(materia: IMateria): void {
		this.apiMateriaService.createMateria(materia)
		.subscribe((created: boolean) => {
			this.getMaterias();
			const message = created
			? 'Materia guardada.'
			: 'Materia duplicada, no se puede efectuar la operación.';
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._shouldCloseFormMateria$.next(true);
			});
		});
	}

	updateMateria(materia: IMateria): void {
		this.apiMateriaService.updateMateria(this._materia$.value.id, materia)
		.subscribe((res: any) => {
			const message = res.updated
			? 'Materia actualizada exitosamente.'
			: 'No se puede actualizar, Existe otra materia con la información suministrada.';
			this.getMaterias();
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._shouldCloseFormMateria$.next(true);
			});
		});
	}

	destroyMateria(idMateria: number): void {
		PopUp.warning('Estas seguro?', 'La materia se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiMateriaService.destroyMateria(idMateria)
			.subscribe((res: any) => {
				const message = +res > 0
				? 'Materia eliminada exitosamente.'
				: 'No se puede eliminar, tiene registros asociados.';
				PopUp.success('Operación exitosa!', message);
				this.getMaterias();
			});
		});
	}
	
	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaMaterias(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getMaterias();
	}

	setMateria(materia: IMateria): void {
		this._materia$.next(materia);
	}

	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	initStateMateria(): void {
		this.initStateCloseFormMateria();
		this._materias$.next([]);
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.searchTerm = '';
		this.page = 1;
		this.pageSize = 10;
	}

	initStateCloseFormMateria(): void {
		this.setMateria(null);
		this.shouldCreate(true);
		this._shouldCloseFormMateria$.next(false);
	}
	
}