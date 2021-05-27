import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { DocenteService } from '@services/docente/docente.service';
import { PlanDocenteService } from '@services/plan-docente/plan-docente.service';
import { IDocente } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-docente',
	templateUrl: './listar-docente.component.html',
	styleUrls: ['./listar-docente.component.scss']
})
export class ListarDocenteComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	@Output() editar = new EventEmitter<boolean>();
	storeDocentes$: Observable<IDocente[]> = this.docenteService.storeDocentes$;
	collectionSize$: Observable<number> = this.docenteService.collectionSize$;
	offset$: Observable<number> = this.docenteService.offset$;
    filter: FormControl = new FormControl('');

	constructor(
		private planDocenteService: PlanDocenteService,
		public docenteService: DocenteService,
	) { }

	ngOnInit(): void {
		this.docenteService.getStoreDocentes();
        this.getDocentesFilter();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	onChangePageSize(value: string): void {
		this.docenteService.pageSize = +value;
		this.docenteService.updateTablaDocentes();
	}
	
	onPageChange(page: number): void {
		this.docenteService.page = page;
		this.docenteService.updateTablaDocentes();
	}

	validateOffset(): number {
		return this.docenteService.validateOffset();
	}

	updateDocente(docente: IDocente): void {
		this.docenteService.setInfoPersonaDocente(docente.persona);
		this.docenteService.setInfoRegistroDocente(docente);
		this.docenteService.shouldCreate(false);
		this.editar.emit(true);
	}

	destroyDocente(docente: IDocente): void {
		this.docenteService.destroyDocente(docente.id);
	}

	openModalCargaAcademica(docente: IDocente): void {
		this.planDocenteService.idDocente = docente.id;
		this.planDocenteService.getStorePlanDocentes();
		this.docenteService.setOpenModalCargaAcademica(true);
	}

	private getDocentesFilter(): void {
		this.filter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.docenteService.searchTerm = searchTerm.toLowerCase();
				return this.docenteService.requestApiDocentes();
			}),
			takeUntil(this.unsubscribe)
		)
		.subscribe((docentes: IDocente[]) =>
		this.docenteService.handleSubscribeDocentes(docentes));
	}

}