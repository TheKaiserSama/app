import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ApiOtrosService } from '@api/api-otros.service';
import { PersonaService } from '@services/persona/persona.service';
import { IPersona, IRol, IUsuario } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-personas',
	templateUrl: './listar-personas.component.html',
	styleUrls: ['./listar-personas.component.scss']
})
export class ListarPersonasComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();
	@Output() editar = new EventEmitter<boolean>();
	collectionSize$: Observable<number> = this.personaService.collectionSize$;
	offset$: Observable<number> = this.personaService.offset$;
	personas$: Observable<IPersona[]> = this.personaService.personas$;
	roles$: Observable<IRol[]>;
	filter: FormControl = new FormControl('');
	rol: FormControl = new FormControl(null);
	compareFn = compareFn;

	constructor(
		private apiOtrosService: ApiOtrosService,
		private modalService: NgbModal,
		public personaService: PersonaService,
	) { }

	ngOnInit(): void {
		this.personaService.getPersonas();
		this.getPersonasFilter();
		this.roles$ = this.apiOtrosService.getRoles([]);

		this.personaService.closeFormUsuario$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((closeModal: boolean) => {
			if (closeModal) this.modalService.dismissAll();
		});
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

	handleRol(rol: IRol): void {
		if (!rol)
			this.personaService.id_rol = null;
		else
			this.personaService.id_rol = rol.id;
		this.personaService.updateTablaPersonas();
	}

	onChange(value: string): void {
		this.personaService.pageSize = +value;
		this.personaService.updateTablaPersonas();
	}
	
	onPageChange(page: number): void {
		this.personaService.page = page;
		this.personaService.updateTablaPersonas();
	}

	validateOffset(): number {
		return this.personaService.validateOffset();
	}

	updatePersona(persona: IPersona): void {
		this.personaService.setPersona(persona);
		this.personaService.setUsuario(persona.usuario);
		this.personaService.shouldCreate(false);
		this.editar.emit(true);
	}

	destroyPersona(persona: IPersona): void {
        this.personaService.destroyPersona(persona);
	}

	destroyUsuario(usuario: IUsuario): void {
		this.personaService.destroyUsuario(usuario.id);
	}

	openModalUsuario(content: any, usuario: IUsuario): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		if (!usuario) return;
		delete usuario.password;
		this.personaService.shouldCreate(false);
		this.personaService.setUsuario(usuario);
		this.modalService.open(content, modalOptions).result
		.then((result: any) => { }, (reason: any) => {
			this.personaService.initStateCloseModal();
        });
	}

	private getPersonasFilter(): void {
		this.filter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.personaService.searchTerm = searchTerm.toLowerCase();
				return this.personaService.requestApiPersonas();
            }),
            takeUntil(this.unsubscribe)
		)
		.subscribe((personas: IPersona[]) =>
		this.personaService.handleSubscribePersonas(personas));
	}

}