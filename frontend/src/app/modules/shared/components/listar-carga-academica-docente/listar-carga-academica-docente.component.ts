import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap, map, takeUntil } from "rxjs/operators";

import { AnioLectivoService } from "@services/anio-lectivo/anio-lectivo.service";
import { AuthenticationService } from "@core/authentication/authentication.service";
import { PlanDocenteService } from '@services/plan-docente/plan-docente.service';
import { LogroService } from "@services/logro/logro.service";
import { IPlanDocente, IAnioLectivo } from "@interfaces/all.interface";
import { getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-carga-academica-docente',
	templateUrl: './listar-carga-academica-docente.component.html',
	styleUrls: ['./listar-carga-academica-docente.component.scss']
})
export class ListarCargaAcademicaDocenteComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	storePlanDocentes$: Observable<IPlanDocente[]> = this.planDocenteService.storePlanDocentes$;
	collectionSize$: Observable<number> = this.planDocenteService.collectionSize$;
	offset$: Observable<number> = this.planDocenteService.offset$;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	ctrFilter: FormControl = new FormControl('');
	ctrAnioLectivo: FormControl = new FormControl(null);

	constructor(
        public authService: AuthenticationService,
		public planDocenteService: PlanDocenteService,
		public logroService: LogroService,
		private anioLectivoService: AnioLectivoService,
	) { }

	ngOnInit(): void {
		this.getPlanDocentesFilter();
		this.aniosLectivos$ = this.anioLectivoService.aniosLectivos$.pipe(
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

	getPlanDocentesFilter(): void {
		this.ctrFilter.valueChanges.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.planDocenteService.searchTerm = searchTerm.toLowerCase();
				return this.planDocenteService.requestApiPlanesDocente();
			}),
			takeUntil(this.unsubscribe),
		).subscribe((docentes: IPlanDocente[]) => this.planDocenteService.handleSubscribePlanesDocente(docentes));
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
    
	updatePlanDocente(planDocente: IPlanDocente): void {
		this.planDocenteService.setPlanDocente(planDocente);
		this.planDocenteService.shouldCreate(false);
	}

	destroyPlanDocente(planDocente: IPlanDocente): void {
		this.planDocenteService.destroyPlanDocente(planDocente.id);
    }

    verLogros(planDocente: IPlanDocente): void {
		this.logroService.idPlanDocente = planDocente.id;
		this.logroService.selectedCarAcad = planDocente;
		this.logroService.cleanLogros();
        this.logroService.getStoreLogros();
	}
	
}