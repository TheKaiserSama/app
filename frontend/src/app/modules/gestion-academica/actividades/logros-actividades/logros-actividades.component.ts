import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { ActividadService } from '@services/actividad/actividad.service';
import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { LogroService } from '@services/logro/logro.service';
import { ILogro, IGrado, IPeriodo, IAnioLectivo } from '@interfaces/all.interface';

@Component({
	selector: 'app-logros-actividades',
	templateUrl: './logros-actividades.component.html',
	styleUrls: ['./logros-actividades.component.scss']
})
export class LogrosActividadesComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	storeLogros$: Observable<ILogro[]> = this.logroService.storeLogros$;
	collectionSize$: Observable<number> = this.logroService.collectionSize$;
	offset$: Observable<number> = this.logroService.offset$;
	grados$: Observable<IGrado[]>;
	periodos$: Observable<IPeriodo[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	ctrFilter: FormControl = new FormControl('');
	ctrPeriodo: FormControl = new FormControl(null);
	ctrGrado: FormControl = new FormControl(null);
	ctrAnioLectivo: FormControl = new FormControl(null);

  	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		private apiPeriodoService: ApiPeriodoService,
		public actividadService: ActividadService,
		public logroService: LogroService,
	) { }

	ngOnInit(): void {
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
		this.logroService.resetLogros();
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
	
	initFieldsSelect(): void {
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.grados$ = this.apiCursoService.getGrados({ vigente: true });
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		this.ctrPeriodo.setValue(null, { emitViewToModelChange: false });
		this.logroService.periodo = null;
		if (anioLectivo && anioLectivo.id) {
			this.logroService.anioLectivo = anioLectivo.anio_actual;
			this.periodos$ = this.apiPeriodoService.getPeriodosPorAnioLectivo(anioLectivo.id);
		} else {
			this.logroService.anioLectivo = null;
			this.periodos$ = of([]);
		}
		this.logroService.updateTablaLogros();
	}
	
	handleGrado(grado: IGrado): void {
		if (grado && grado.id)
			this.logroService.grado = +grado.grado;
		else
			this.logroService.grado = null;
		this.logroService.updateTablaLogros();
	}

	handlePeriodo(periodo: IPeriodo): void {
		if (periodo && periodo.id)
			this.logroService.periodo = periodo.numero;
		else
			this.logroService.periodo = null;
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
    
	verLogro(logro: ILogro): void {
		this.actividadService.idLogro = logro.id;
		this.actividadService.selectedLogro = logro;
		this.actividadService.cleanActividades();
		this.actividadService.getStoreActividades();
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
