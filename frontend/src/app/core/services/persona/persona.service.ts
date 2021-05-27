import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiPersonaService } from '@api/api-persona.service';
import { ApiUsuarioService } from '@api/api-usuario.service';
import { IUsuario, IPersona, IAlmacenPersona, IRol } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class PersonaService {
	
	private _personas$ = new BehaviorSubject<IPersona[]>([]);
	private _persona$ = new BehaviorSubject<IPersona>(null);
	private _usuario$ = new BehaviorSubject<IUsuario>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _closeFormPersona$ = new BehaviorSubject<boolean>(false);
	private _closeFormUsuario$ = new BehaviorSubject<boolean>(false);
	private _tabActive$ = new BehaviorSubject<number>(1);
	personas$: Observable<IPersona[]> = this._personas$.asObservable();
	persona$: Observable<IPersona> = this._persona$.asObservable();
	usuario$: Observable<IUsuario> = this._usuario$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	closeFormPersona$: Observable<boolean> = this._closeFormPersona$.asObservable();
	closeFormUsuario$: Observable<boolean> = this._closeFormUsuario$.asObservable();
	tabActive$: Observable<number> = this._tabActive$.asObservable();
	searchTerm: string = '';
	page: number = 1;
	pageSize: number = 10;
	id_rol: number;
	rol: IRol;

	constructor(
		private apiPersonaService: ApiPersonaService,
		private apiUsuarioService: ApiUsuarioService,
	) { }

	getPersonas(): void {
		this.requestApiPersonas().subscribe((personas: IPersona[]) =>
		this.handleSubscribePersonas(personas));
	}

	getPersonaPorDocumento(documento: string): Observable<IPersona> {
		const id = (this._persona$.value && this._persona$.value.id) ? this._persona$.value.id : null;
		return this.apiPersonaService.getPersonaPorNumeroDocumento(documento, { id: id });	
	}

	requestApiPersonas(): Observable<IPersona[]> {
		this._loading$.next(true);
		return this.apiPersonaService.getPersonas(this.pageSize, this._offset$.value, this.searchTerm, this.id_rol).pipe(
			map((personas: IAlmacenPersona) => {
				this._collectionSize$.next(personas.count);
				return personas.rows.map((persona: IPersona, index: number) =>
					({ index: this._offset$.value + index + 1, ...persona }));
			})
		);
	}

	handleSubscribePersonas(personas: IPersona[]): void {
		this._loading$.next(false);
		this._personas$.next(personas);
	}

	createPersona(persona: IPersona): void {
		this.apiPersonaService.createPersona(persona)
		.subscribe(([created, persona]: [boolean, IPersona]) => {
			this.getPersonas();
			const message = created
			? 'Persona guardada.'
			: 'Persona duplicada, no se puede efectuar la operación.';
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._closeFormPersona$.next(true);
			});
		});
	}

	createPersonaConUsuario(): void {
		const persona = this._persona$.value;
		const usuario = this._usuario$.value;

		this.apiPersonaService.createPersona(persona)
		.pipe(
			concatMap(([created, persona]: [boolean, IPersona]) => {
				if (persona) {
					const newUsuario = {
						...usuario,
						id_persona: persona.id,
						id_rol: persona.id_rol
					};
					return this.apiUsuarioService.createUsuario(newUsuario);
				}
			})
		)
		.subscribe((created: boolean) => {
			this.getPersonas();
			const message = created
			? 'Persona guardada.'
			: 'Persona duplicada, no se puede efectuar la operación.';
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._closeFormPersona$.next(true);
			});
		});
	}

	updatePersona(persona: IPersona): void {
		this.apiPersonaService.updatePersona(this._persona$.value.id, persona)
		.subscribe((res: any) => {
			const message = res.updated
			? 'Persona actualizada exitosamente.'
			: 'No se puede actualizar, Existe otra persona con la información suministrada.';
			this.getPersonas();
			PopUp.success('Operación exitosa!', message)
			.then((result: SweetAlertResult) => {
				this._closeFormPersona$.next(true);
			});
		});
	}

	updateUsuario(usuario: IUsuario): void {
		const id = this._usuario$.value ? this._usuario$.value.id : null;
		if (id) {
			const newUsuario = {
				...this._usuario$.value,
				...usuario
			};
			this.apiUsuarioService.updateUsuario(id, newUsuario)
			.subscribe((res: any) => {
				const message = res.affectedCount
				? 'Usuario actualizado exitosamente.'
				: 'Ningún usauario afectado';
				this.getPersonas();
				PopUp.success('Operación exitosa!', message)
				.then((result: SweetAlertResult) => {
					this._closeFormUsuario$.next(true);
					this._closeFormPersona$.next(true);
				});
			});
		}
	}

	destroyPersona(persona: IPersona): void {
		PopUp.warning('Estas seguro?', 'La persona se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiPersonaService.destroyPersona(persona.id)
			.subscribe((res: any) => {
				const message = res.deleted
				? 'Persona eliminada exitosamente.'
				: 'No se puede eliminar, tiene usuario asociado.';
				PopUp.success('Operación exitosa!', message);
				this.getPersonas();
			});
		});
	}

	destroyUsuario(id: number): void {
		PopUp.warning('Estas seguro?', 'La cuenta de usuario se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiUsuarioService.destroyUsuario(id)
			.subscribe((res: any) => {
				const message = res.affectedRows > 0
				? 'Cuenta de usuario eliminada exitosamente.'
				: 'No se puede eliminar la cuenta de usuario.';
				PopUp.success('Operación exitosa!', message);
				this.getPersonas();
			});
		});
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaPersonas(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getPersonas();
	}

	setPersona(persona: IPersona): void {
		this._persona$.next(persona);
	}

	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	setUsuario(usuario: IUsuario): void {
		this._usuario$.next(usuario);
	}

	setTabActive(tabActive: number): void {
		this._tabActive$.next(tabActive);
	}

	initStatePersona(): void {
		this.initStateCloseModal();
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.searchTerm = '';
		this.page = 1;
		this.pageSize = 10;
		this.id_rol = null;
	}

	initStateCloseModal(): void {
		this.setPersona(null);
		this.setUsuario(null);
		this.shouldCreate(true);
		this._closeFormPersona$.next(false);
		this.setTabActive(1);
	}

}
