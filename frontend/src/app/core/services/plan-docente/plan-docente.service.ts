import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiPlanDocenteService } from '@api/api-plan-docente.service';
import { PopUp } from '@shared/pop-up';
import { IAlmacenPlanDocente, IPlanDocente } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class PlanDocenteService {

	private _storePlanDocentes$ = new BehaviorSubject<IPlanDocente[]>([]);
	private _planDocente$ = new BehaviorSubject<IPlanDocente>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _closeFormPlanDocente$ = new BehaviorSubject<boolean>(false);
	private _openModalCargaAcademica$ = new BehaviorSubject<boolean>(false);
	private _tabActive$ = new BehaviorSubject<number>(1);
	storePlanDocentes$: Observable<IPlanDocente[]> = this._storePlanDocentes$.asObservable();
	planDocente$: Observable<IPlanDocente> = this._planDocente$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	closeFormPlanDocente$: Observable<boolean> = this._closeFormPlanDocente$.asObservable();
	openModalCargaAcademica$: Observable<boolean> = this._openModalCargaAcademica$.asObservable();
	tabActive$: Observable<number> = this._tabActive$.asObservable();

	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;
	idDocente: number = 0;
	idAnioLectivo: number;

	constructor(private apiPlanDocenteService: ApiPlanDocenteService) { }

	getStorePlanDocentes(): void {
		this.requestApiPlanesDocente().subscribe((cargasAcademicas: IPlanDocente[]) =>
		this.handleSubscribePlanesDocente(cargasAcademicas));
	}

	requestApiPlanesDocente(): Observable<IPlanDocente[]> {
		this._loading$.next(true);
		const objParams = {
			limit: this.pageSize,
			offset: this._offset$.value,
			search_term: this.searchTerm,
			id_anio_lectivo: this.idAnioLectivo
		};
		return this.apiPlanDocenteService.getPlanesDocente(this.idDocente, objParams).pipe(
			map((planDocentes: IAlmacenPlanDocente) => {
				this._collectionSize$.next(planDocentes.count);
				return planDocentes.rows.map((docente: IPlanDocente, index: number) =>
					({ index: this._offset$.value + index + 1, ...docente }));
			})
		);
	}

	handleSubscribePlanesDocente(planDocentes: IPlanDocente[]): void {
		this._loading$.next(false);
		this._storePlanDocentes$.next(planDocentes);
	}

	getCargasAcademicasParametrosOpcionales(params: any = {}): Observable<IPlanDocente[]> {
		return this.apiPlanDocenteService.getCursosPorPeriodo(params);
	}

	createPlanDocente(): Observable<IPlanDocente> {
		this.setPlanDocente({ id_docente: this.idDocente, ...this._planDocente$.value });
		return this.apiPlanDocenteService.createPlanDocente(this._planDocente$.value).pipe(
			map((planDocente: IPlanDocente) => {
				this.getStorePlanDocentes();
				this.setPlanDocente(null);
				PopUp.success('Creada!', 'Carga academica guardada.').
				then((result: SweetAlertResult) => {
					this.setTabActive(1);
					this.setCloseFormPlanDocente(true);
				});
				return planDocente;
			})
		);
	}

	updatePlanDocente(): Observable<IPlanDocente> {
		return this.apiPlanDocenteService.updatePlanDocente(this._planDocente$.value, this._planDocente$.value.id)
		.pipe(
			map((planDocente: IPlanDocente) => {
				this.getStorePlanDocentes();
				this.setPlanDocente(null);
				PopUp.success('Editada!', 'Carga academica editada.').
				then((result: SweetAlertResult) => {
					this.setTabActive(1);
					this.setCloseFormPlanDocente(true);
					this.shouldCreate(true);
				});
				return planDocente;
			})
		);
	}

	destroyPlanDocente(id: number): void {
		PopUp.warning('Estas seguro/a?', 'La carga academica se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiPlanDocenteService.destroyPlanDocente(id).subscribe((data: any) => {
				if (data.affectedRows < 1) return;
				PopUp.success('Eliminada!', 'Carga academica eliminada.');
				this.getStorePlanDocentes();
			});
		});
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaPlanesDocente(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getStorePlanDocentes();
	}

	setPlanDocente(planDocente: IPlanDocente): void {
		if (!planDocente) return this._planDocente$.next(null);
		if (!this._planDocente$.value) return this._planDocente$.next(planDocente);
		this._planDocente$.next({ ...this._planDocente$.value, ...planDocente });
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	setCloseFormPlanDocente(value: boolean): void {
		this._closeFormPlanDocente$.next(value);
	}

	setOpenModalCargaAcademica(value: boolean): void {
		this._openModalCargaAcademica$.next(value);
	}

	setTabActive(tabActive: number): void {
		this._tabActive$.next(tabActive);
	}

	initStatePlanDocente(): void {
		this.initStateCloseModal();
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.searchTerm = '';
		this.page = 1;
		this.pageSize = 10;
		this.idDocente = 0;
		this.idAnioLectivo = null;
	}

	initStateCloseModal(): void {
		this.setPlanDocente(null);
		this.shouldCreate(true);
		this.setCloseFormPlanDocente(false);
		this.setTabActive(1);
		this.setOpenModalCargaAcademica(false);
	}

}
