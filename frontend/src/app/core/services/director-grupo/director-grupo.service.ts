import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ApiDirectorGrupoService } from '@api/api-director-grupo.service';
import { IAlmacenDirectorGrupo, IDirectorGrupo } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class DirectorGrupoService {

	private _directoresGrupo$ = new BehaviorSubject<IDirectorGrupo[]>([]);
	private _directoresGrupoAsignados$ = new BehaviorSubject<IDirectorGrupo[]>([]);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	directoresGrupoAsignados$: Observable<IDirectorGrupo[]> = this._directoresGrupoAsignados$.asObservable();
	directoresGrupo$: Observable<IDirectorGrupo[]> = this._directoresGrupo$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;
	params: any = {};

	constructor(private apiDirectorGrupoService: ApiDirectorGrupoService) { }

	getDirectoresGrupo(): void {
		this.requestApiDirectoresGrupo().subscribe((directoresGrupo: IDirectorGrupo[]) =>
		this.handleSubscribeDirectoresGrupo(directoresGrupo));
	}

	requestApiDirectoresGrupo(): Observable<IDirectorGrupo[]> {
		this._loading$.next(true);
		const objParams = {
			limit: this.pageSize,
			offset: this._offset$.value,
			search_term: this.searchTerm,
			id_sede: this.params.id_sede,
			id_anio_lectivo: this.params.id_anio_lectivo,
			id_curso: this.params.id_curso
		};
		return this.apiDirectorGrupoService.getDirectoresGrupo(objParams).pipe(
			map((directoresGrupo: IAlmacenDirectorGrupo) => {
				this._collectionSize$.next(directoresGrupo.count);
				return directoresGrupo.rows.map((directorGrupo: IDirectorGrupo, index: number) =>
					({ index: this._offset$.value + index + 1, ...directorGrupo }));
			})
		);
	}

	handleSubscribeDirectoresGrupo(directoresGrupo: IDirectorGrupo[]): void {
		this._loading$.next(false);
		this._directoresGrupo$.next(directoresGrupo);
	}

	getDirectoresGrupoAsignados(params: any = {}): void {
		const { id_sede, id_anio_lectivo } = params;
		this.apiDirectorGrupoService.getDirectoresPorAnioLectivo({ id_sede, id_anio_lectivo }).pipe(take(1))
		.subscribe((directoresGrupo: IDirectorGrupo[]) => this._directoresGrupoAsignados$.next(directoresGrupo));
	}

	createDirectorGrupo(directorGrupo: IDirectorGrupo): Observable<boolean> {
		return this.apiDirectorGrupoService.createDirectorGrupo(directorGrupo).pipe(take(1));
	}

	destroyDirectorGrupo(id: number): Observable<number> {
		return this.apiDirectorGrupoService.destroyDirectorGrupo(id).pipe(take(1));
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaDirectoresGrupo(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getDirectoresGrupo();
	}

}
