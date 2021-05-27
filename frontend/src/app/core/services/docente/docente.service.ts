import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { SweetAlertResult } from 'sweetalert2';

import { ApiDocenteService } from '@api/api-docente.service';
import { IPersona, IDocente, IAlmacenDocente } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class DocenteService {

	private _storeDocentes$ = new BehaviorSubject<IPersona[]>([]);
	private _infoPersonaDocente$ = new BehaviorSubject<IPersona>(null);
	private _infoRegistroDocente$ = new BehaviorSubject<IDocente>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _closeFormDocente$ = new BehaviorSubject<boolean>(false);
	private _openModalCargaAcademica$ = new BehaviorSubject<boolean>(false);
	private _tabActive$ = new BehaviorSubject<number>(1);
	storeDocentes$: Observable<IPersona[]> = this._storeDocentes$.asObservable();
	infoPersonaDocente$: Observable<IPersona> = this._infoPersonaDocente$.asObservable();
	infoRegistroDocente$: Observable<IDocente> = this._infoRegistroDocente$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	closeFormDocente$: Observable<boolean> = this._closeFormDocente$.asObservable();
	openModalCargaAcademica$: Observable<boolean> = this._openModalCargaAcademica$.asObservable();
	tabActive$: Observable<number> = this._tabActive$.asObservable();
	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;

	constructor(private apiDocenteService: ApiDocenteService) { }

	getStoreDocentes(): void {
		this.requestApiDocentes().subscribe((docentes: IDocente[]) => 
		this.handleSubscribeDocentes(docentes));
	}

	requestApiDocentes(): Observable<IDocente[]> {
		this._loading$.next(true);
		return this.apiDocenteService.getDocentes(this.pageSize, this._offset$.value, this.searchTerm).pipe(
			map((docentes: IAlmacenDocente) => {
				this._collectionSize$.next(docentes.count);
				return docentes.rows.map((docente: IDocente, index: number) =>
					({ index: this._offset$.value + index + 1, ...docente }));
			})
		);
	}

	handleSubscribeDocentes(docentes: IDocente[]): void {
		this._loading$.next(false);
		this._storeDocentes$.next(docentes);
	}
	
	createDocente(docente: IDocente): void {
		this.apiDocenteService.createDocente(this.getExpandedDocente(docente))
		.subscribe((docente: IDocente) => {
			this.getStoreDocentes();
			this.initStateCloseModal();
			PopUp.success('Creado!', 'Docente creado.')
			.then((result: SweetAlertResult) => {
				this.setTabActive(1);
				this._closeFormDocente$.next(true);
			});
			this._closeFormDocente$.next(false);
		});
	}

	updateDocente(docente: IDocente): void {
		this.apiDocenteService.updateDocente(this.getExpandedDocente(docente))
		.subscribe((docente: IDocente) => {
			this.getStoreDocentes();
			this.initStateCloseModal();
			PopUp.success('Editado!', 'Docente editado exitosamente.')
			.then((result: SweetAlertResult) => {
				this.setTabActive(1);
				this._closeFormDocente$.next(true);
			});
			this._closeFormDocente$.next(false);
		});
	}

	destroyDocente(id: number): void {
		PopUp.warning('Estas seguro?', 'El docente se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiDocenteService.destroyDocente(id)
			.subscribe((data: any) => {
				if (data.affectedRows < 1) return;
				PopUp.success('Eliminada!', 'Docente eliminado.');
				this.getStoreDocentes();
			});
		});
	}

	getExpandedDocente(updateDocente: IDocente): any {
		const previousDocente: IDocente = JSON.parse(JSON.stringify(this._infoRegistroDocente$.value));
		const infoPersonaDocente: IPersona = JSON.parse(JSON.stringify(this._infoPersonaDocente$.value));
		let currentDocente: IDocente;

		if (!previousDocente) {
		 	currentDocente = {
				...updateDocente, persona: infoPersonaDocente
			};
		} else {
			currentDocente = {
				...previousDocente, ...updateDocente,
				persona: infoPersonaDocente
			};
		}
		return currentDocente;
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaDocentes(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getStoreDocentes();
	}

	setInfoPersonaDocente(persona: IPersona): void {
		if (!persona) return this._infoPersonaDocente$.next(null);
		if (!this._infoPersonaDocente$.value) return this._infoPersonaDocente$.next(persona);
		this._infoPersonaDocente$.next({ ...this._infoPersonaDocente$.value, ...persona });
	}

	setInfoRegistroDocente(docente: IDocente): void {
		if (!docente) return this._infoRegistroDocente$.next(null);
		if (!this._infoRegistroDocente$.value) return this._infoRegistroDocente$.next(docente);
		this._infoRegistroDocente$.next({
			...this._infoRegistroDocente$.value, ...docente
		});
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	setOpenModalCargaAcademica(value: boolean): void {
		this._openModalCargaAcademica$.next(value);
	}

	setTabActive(tabActive: number): void {
		this._tabActive$.next(tabActive);
	}

	initStateDocente(): void {
		this.initStateCloseModal();
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.setOpenModalCargaAcademica(false);
		this.searchTerm = '';
		this.page = 1;
		this.pageSize = 10;
	}

	initStateCloseModal(): void {
		this.setInfoPersonaDocente(null);
		this.setInfoRegistroDocente(null);
		this.shouldCreate(true);
		this._closeFormDocente$.next(false);
		this.setTabActive(1);
	}
	
}
