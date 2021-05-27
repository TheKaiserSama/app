import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';
import { FormControl } from '@angular/forms';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { GradoMateriaService } from '@services/grado-materia/grado-materia.service';
import { IAnioLectivo, ICursoMateria, IGrado, IGradoMateria } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-cursos-materias',
	templateUrl: './listar-cursos-materias.component.html',
	styleUrls: ['./listar-cursos-materias.component.scss']
})
export class ListarCursosMateriasComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	collectionSize$: Observable<number> = this.gradoMateriaService.collectionSize$;
	offset$: Observable<number> = this.gradoMateriaService.offset$;
	cursosMateria$: Observable<ICursoMateria[]> = this.gradoMateriaService.gradosMaterias$;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	ctrSearch: FormControl = new FormControl(null);
	ctrAnioLectivo: FormControl = new FormControl(null);
	ctrGrado: FormControl = new FormControl(null);
	compareFn = compareFn;
	
	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		public gradoMateriaService: GradoMateriaService,
	) { }

	ngOnInit(): void {
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.grados$ = this.apiCursoService.getGrados({ vigente: true });
		this.gradoMateriaService.getGradosMaterias();
		this.getGradosMateriasFilter();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
	
	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		if (anioLectivo)
			this.gradoMateriaService.objParams.id_anio_lectivo = anioLectivo.id
		else
			this.gradoMateriaService.objParams.id_anio_lectivo = null;
		this.gradoMateriaService.getGradosMaterias();
	}

	handleGrado(grado: IGrado): void {
		if (grado)
			this.gradoMateriaService.objParams.id_grado = grado.id
		else
			this.gradoMateriaService.objParams.id_grado = null;
		this.gradoMateriaService.getGradosMaterias();
	}

	onChange(value: string): void {
		this.gradoMateriaService.pageSize = +value;
		this.gradoMateriaService.updateTablaGradoMateria();
	}
	
	onPageChange(page: number): void {
		this.gradoMateriaService.page = page;
		this.gradoMateriaService.updateTablaGradoMateria();
	}

	validateOffset(): number {
		return this.gradoMateriaService.validateOffset();
	}

	updateGradoMateria(gradoMateria: IGradoMateria): void {
		this.gradoMateriaService.setGradoMateria(gradoMateria);
		this.gradoMateriaService.shouldCreate(false);
	}

	destroyCursoMateria(gradoMateria: IGradoMateria): void {
		PopUp.warning('Estas seguro?', 'La materia será removida del curso actual!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.gradoMateriaService.destroyGradoMateria(gradoMateria.id)
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((res: any) => {
				if (!res) return;
				this.gradoMateriaService.shouldCreate(true);
				this.gradoMateriaService.setGradoMateria(null);
			});
		});
	}

	private getGradosMateriasFilter(): void {
		this.ctrSearch.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.gradoMateriaService.objParams.search_term = searchTerm.toLowerCase();
				return this.gradoMateriaService.requestApiGradoMateria();
            }),
            takeUntil(this.unsubscribe)
		)
		.subscribe((personas: IGradoMateria[]) => this.gradoMateriaService.handleSubscribeGradoMateria(personas));
	}

}