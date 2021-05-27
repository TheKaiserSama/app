import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, concatMap } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ActividadService } from "@services/actividad/actividad.service";
import { AnioLectivoService } from "@services/anio-lectivo/anio-lectivo.service";
import { GradoService } from "@services/grado/grado.service";
import { LogroService } from "@services/logro/logro.service";
import { PeriodoService } from "@services/periodo/periodo.service";
import { ILogro, IGrado, IPeriodo, IAnioLectivo } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-logros',
	templateUrl: './listar-logros.component.html',
	styleUrls: ['./listar-logros.component.scss']
})
export class ListarLogrosComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	storeLogros$: Observable<ILogro[]> = this.logroService.storeLogros$;
	collectionSize$: Observable<number> = this.logroService.collectionSize$;
	offset$: Observable<number> = this.logroService.offset$;
	periodos$: Observable<IPeriodo[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	ctrFilter: FormControl = new FormControl('');
	ctrPeriodo: FormControl = new FormControl(null);
	ctrGrado: FormControl = new FormControl(null);
	ctrAnioLectivo: FormControl = new FormControl(null);

  	constructor(
		public actividadService: ActividadService,
		public logroService: LogroService,
		private anioLectivoService: AnioLectivoService,
		private periodoService: PeriodoService,
		private gradoService: GradoService
	) { }

	ngOnInit(): void {
		console.log('Hola')
		this.initFieldsSelect();
		if (this.logroService.initListLogros) {
			return this.logroService.getStoreLogros();
		}
		this.logroService.setStoreLogros([]);
		this.getLogrosFilter();
	}
	
	ngOnDestroy(): void {
		this.actividadService.selectedLogro = null;
		this.logroService.cleanLogros();
		// this.logroService.initStateLogro();
		this.logroService.resetLogros();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getLogrosFilter(): void {
		this.ctrFilter.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.logroService.searchTerm = searchTerm.toLowerCase();
				return this.logroService.requestApiLogros();
			}),
			takeUntil(this.unsubscribe),
		).subscribe((docentes: ILogro[]) => this.logroService.handleSubscribeLogros(docentes));
	}
	
	initFieldsSelect(): void {
		this.anioLectivoService.getAniosLectivos();
		this.gradoService.getGrados();
		this.grados$ = this.gradoService.grados$;
		this.aniosLectivos$ = this.anioLectivoService.aniosLectivos$;
		this.periodos$ = this.anioLectivoService.getAnioLectivoPorNumero(new Date().getFullYear()).pipe(concatMap(
		(anioLectivo: IAnioLectivo) => this.periodoService.getPeriodosPorAnioLectivo(anioLectivo.id)));
	}

	handleGrado(grado: IGrado): void {
		if (!grado) {
			this.logroService.grado = null;
		} else {
			this.logroService.grado = +grado.grado;
		}
		this.logroService.updateTablaLogros();
	}

	handlePeriodo(periodo: IPeriodo): void {
		if (!periodo) {
			this.logroService.periodo = null;
		} else {
			this.logroService.periodo = periodo.numero;
		}
		this.logroService.updateTablaLogros();
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		if (!anioLectivo) {
			this.logroService.anioLectivo = null;	
		} else {
			this.logroService.anioLectivo = anioLectivo.anio_actual;
		}
		this.logroService.updateTablaLogros();
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

	verLogro(logro: ILogro): void {
		this.actividadService.idLogro = logro.id;
		this.actividadService.selectedLogro = logro;
		this.actividadService.cleanActividades();
		this.actividadService.getStoreActividades();
	}

	destroyLogro(): void {
		PopUp.warning('Esta seguro/a?', 'Esta operacion es irreversible, se eliminara toda la información asociada!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.logroService.destroyLogros();
		});
	}

}