import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { LogroService } from '@services/logro/logro.service';
import { ILogro } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-logros-docente',
	templateUrl: './listar-logros-docente.component.html',
	styleUrls: ['./listar-logros-docente.component.scss']
})
export class ListarLogrosDocenteComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	storeLogros$: Observable<ILogro[]> = this.logroService.storeLogros$;
	collectionSize$: Observable<number> = this.logroService.collectionSize$;
	offset$: Observable<number> = this.logroService.offset$;
	ctrFilter: FormControl = new FormControl('');

  	constructor(public logroService: LogroService) { }

	ngOnInit(): void {
		if (this.logroService.initListLogros) {
			return this.logroService.getStoreLogros();
		}
		this.logroService.setStoreLogros([]);
		this.getLogrosFilter();
	}
	
	ngOnDestroy(): void {
		this.logroService.cleanLogros();
		this.logroService.resetLogros();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	onChangePageSize(value: string): void {
		this.logroService.pageSize = +value;
		this.logroService.updateTablaLogros();
	}

	onPageChange(page: number): void {
		this.logroService.page = page;
		this.logroService.updateTablaLogros();
	}

	validateOffset(): number {
		return this.logroService.validateOffset();
    }
    
    openModalCrearLogro(): void {
		this.logroService.setOpenModalLogro(true);
	}
	
	openModalEditarLogro(): void {
		this.logroService.create = false;
		this.logroService.setOpenModalLogro(true);
		this.logroService.newListLogros();
	}

	destroyLogro(): void {
		PopUp.warning('Esta seguro/a?', 'Esta operacion es irreversible, se eliminara toda la información asociada!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.logroService.destroyLogros();
		});
	}

	private getLogrosFilter(): void {
		this.ctrFilter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.logroService.searchTerm = searchTerm.toLowerCase();
				return this.logroService.requestApiLogros();
			}),
			takeUntil(this.unsubscribe),
		)
		.subscribe((docentes: ILogro[]) => this.logroService.handleSubscribeLogros(docentes));
	}

}
