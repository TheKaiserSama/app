import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ActividadService } from '@services/actividad/actividad.service';
import { ILogro, IActividad } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-actividades',
	templateUrl: './listar-actividades.component.html',
	styleUrls: ['./listar-actividades.component.scss']
})
export class ListarActividadesComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	storeActividades$: Observable<ILogro[]> = this.actividadService.storeActividades$;
	collectionSize$: Observable<number> = this.actividadService.collectionSize$;
	offset$: Observable<number> = this.actividadService.offset$;
	ctrFilter: FormControl = new FormControl('');

	constructor(public actividadService: ActividadService) { }

	ngOnInit(): void {
		this.getActividadesFilter();
	}

	ngOnDestroy(): void {
		this.actividadService.cleanActividades();
		this.actividadService.resetActividades();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	onChangePageSize(value: string): void {
		this.actividadService.pageSize = +value;
		this.actividadService.updateTablaActividades();
	}

	onPageChange(page: number): void {
		this.actividadService.page = page;
		this.actividadService.updateTablaActividades();
	}

	validateOffset(): number {
		return this.actividadService.validateOffset();
	}
	
	openModalCrearActividad(): void {
		this.actividadService.setOpenModalActividad(true);
	}
	
	openModalEditarActividad(): void {
		this.actividadService.create = false;
		this.actividadService.setOpenModalActividad(true);
		this.actividadService.newListActividades();
	}

	destroyActividad(): void {
		PopUp.warning('Esta seguro/a?', 'Esta operacion es irreversible, se eliminara toda la informació asociada!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.actividadService.destroyActividades();
		});
	}

	private getActividadesFilter(): void {
		this.ctrFilter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.actividadService.searchTerm = searchTerm.toLowerCase();
				return this.actividadService.requestApiActividades();
			}),
			takeUntil(this.unsubscribe),
		)
		.subscribe((actividades: IActividad[]) => 
		this.actividadService.handleSubscribeActividades(actividades));
	}
}