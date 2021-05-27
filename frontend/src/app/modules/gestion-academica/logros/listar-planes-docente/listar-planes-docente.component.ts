import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, takeUntil } from 'rxjs/operators';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { LogroService } from '@services/logro/logro.service';
import { PlanDocenteService } from '@services/plan-docente/plan-docente.service';
import { IPlanDocente, IAnioLectivo } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-planes-docente',
	templateUrl: './listar-planes-docente.component.html',
	styleUrls: ['./listar-planes-docente.component.scss']
})
export class ListarPlanesDocenteComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	storePlanDocentes$: Observable<IPlanDocente[]> = this.planDocenteService.storePlanDocentes$;
	collectionSize$: Observable<number> = this.planDocenteService.collectionSize$;
	offset$: Observable<number> = this.planDocenteService.offset$;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	ctrFilter: FormControl = new FormControl('');
	ctrAnioLectivo: FormControl = new FormControl(null);

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		public logroService: LogroService,
		public planDocenteService: PlanDocenteService,
	) { }

	ngOnInit(): void {
		this.getPlanesDocenteFilter();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true })
		.pipe(
			map((aniosLectivos: IAnioLectivo[]) => {
				const index = aniosLectivos.findIndex((anioLectivo: IAnioLectivo) => anioLectivo.anio_actual == getCurrentYear());
				if (index > -1) {
					this.ctrAnioLectivo.setValue(aniosLectivos[index]);
				}
				return aniosLectivos;
			})
		);
	}

	ngOnDestroy(): void {
		this.logroService.selectedCarAcad = null;
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

	onChangePageSize(value: string): void {
		this.planDocenteService.pageSize = +value;
		this.planDocenteService.updateTablaPlanesDocente();
	}
	
	onPageChange(page: number): void {
		this.planDocenteService.page = page;
		this.planDocenteService.updateTablaPlanesDocente();
	}

	validateOffset(): number {
		return this.planDocenteService.validateOffset();
	}

    handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		this.planDocenteService.idAnioLectivo = anioLectivo.id;
		this.planDocenteService.updateTablaPlanesDocente();
    }

    verLogros(planDocente: IPlanDocente): void {
		this.logroService.idPlanDocente = planDocente.id;
		this.logroService.selectedCarAcad = planDocente;
		this.logroService.cleanLogros();
        this.logroService.getStoreLogros();
	}

	private getPlanesDocenteFilter(): void {
		this.ctrFilter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.planDocenteService.searchTerm = searchTerm.toLowerCase();
				return this.planDocenteService.requestApiPlanesDocente();
			}),
			takeUntil(this.unsubscribe),
		)
		.subscribe((docentes: IPlanDocente[]) =>
		this.planDocenteService.handleSubscribePlanesDocente(docentes));
	}

}
