import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { AnioLectivoService } from '@services/anio-lectivo/anio-lectivo.service';
import { PeriodoService } from '@services/periodo/periodo.service';
import { IAnioLectivo, IPeriodo } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-periodos',
	templateUrl: './listar-periodos.component.html',
	styleUrls: ['./listar-periodos.component.scss']
})
export class ListarPeriodosComponent implements OnInit {

	@Output() editar = new EventEmitter<boolean>();
	collectionSize$: Observable<number> = this.periodoService.collectionSize$;
	offset$: Observable<number> = this.periodoService.offset$;
	periodos$: Observable<IPeriodo[]> = this.periodoService.periodos$;
	ctrAnioLectivo: FormControl = new FormControl();
	compareFn = compareFn;

	constructor(
		public anioLectivoService: AnioLectivoService,
		public periodoService: PeriodoService
	) { }

	ngOnInit(): void {
		this.anioLectivoService.objParams = {};
		this.anioLectivoService.getAniosLectivos();
		this.periodoService.getPeriodos();
	}

	onChange(value: string): void {
		this.periodoService.pageSize = +value;
		this.periodoService.updateTablaPeriodos();
	}
	
	onPageChange(page: number): void {
		this.periodoService.page = page;
		this.periodoService.updateTablaPeriodos();
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		if (!anioLectivo)
			this.periodoService.anioLectivo = null;
		else
			this.periodoService.anioLectivo = anioLectivo.anio_actual;
		this.periodoService.getPeriodos();
	}

	validateOffset(): number {
		return this.periodoService.validateOffset();
	}

	updatePeriodo(periodo: IPeriodo): void {
		if (!periodo && !periodo.id) return;
		this.periodoService.periodo = periodo;
		this.periodoService.setPeriodo(periodo);
		this.periodoService.shouldCreate(false);
		this.editar.emit(true);
	}

	destroyPeriodo(periodo: IPeriodo): void {
		if (!periodo && !periodo.id) return;
		this.periodoService.destroyPeriodo(periodo.id);
	}

}