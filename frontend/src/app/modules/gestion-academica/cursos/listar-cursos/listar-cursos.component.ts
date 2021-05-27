import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiInstitucionService } from '@api/api-institucion.service';
import { CursoService } from '@services/curso/curso.service';
import { ICurso, IGrado, IAnioLectivo, ISede } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-listar-cursos',
	templateUrl: './listar-cursos.component.html',
	styleUrls: ['./listar-cursos.component.scss']
})
export class ListarCursosComponent implements OnInit, OnDestroy {

	@Output() editar = new EventEmitter<boolean>();
	collectionSize$: Observable<number> = this.cursoService.collectionSize$;
	offset$: Observable<number> = this.cursoService.offset$;
	cursos$: Observable<ICurso[]> = this.cursoService.cursos$;
	sedes$: Observable<ISede[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	ctrSede: FormControl = new FormControl();
	ctrAnioLectivo: FormControl = new FormControl();
	ctrGrado: FormControl = new FormControl();
	ctrGrupo: FormControl = new FormControl();
	compareFn = compareFn;
	modalOptions: NgbModalOptions = {
        ariaLabelledBy: 'modal-basic',
        backdrop: 'static',
        keyboard: false,
		windowClass: 'modal-anio-lectivo',
	};
	
	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		private apiInstitucionService: ApiInstitucionService,
		public cursoService: CursoService,
	) { }

	ngOnInit(): void {
		this.sedes$ = this.apiInstitucionService.getSedes();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.cursoService.getCursos();
		this.reloadGrados();
	}

	ngOnDestroy(): void {
		this.cursoService.initStateCurso();
	}

	onChange(value: string): void {
		this.cursoService.pageSize = +value;
		this.cursoService.updateTablaCursos();
	}
	
	onPageChange(page: number): void {
		this.cursoService.page = page;
		this.cursoService.updateTablaCursos();
	}

	validateOffset(): number {
		return this.cursoService.validateOffset();
	}

	handleSede(sede: ISede): void {
		if (!sede)
			this.cursoService.objParams.id_sede = null;
		else
			this.cursoService.objParams.id_sede = sede.id;
		this.cursoService.updateTablaCursos();
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		if (!anioLectivo)
			this.cursoService.objParams.id_anio_lectivo = null;
		else
			this.cursoService.objParams.id_anio_lectivo = anioLectivo.id;
		this.cursoService.updateTablaCursos();
	}

	handleGrado(grado: IGrado): void {
		if (!grado)
			this.cursoService.objParams.id_grado = null;
		else
			this.cursoService.objParams.id_grado = grado.id;
		this.cursoService.updateTablaCursos();
	}

	updateCurso(curso: ICurso): void {
		if (!curso && !curso.id) return;
		this.cursoService.curso = curso;
		this.cursoService.setCurso(curso);
		this.cursoService.shouldCreate(false);
		this.editar.emit(true);
	}

	destroyCurso(curso: ICurso): void {
		if (!curso && !curso.id) return;
		this.cursoService.destroyCurso(curso.id);
	}

	reloadGrados(): void {
		this.grados$ = this.apiCursoService.getGrados({ vigente: true });
	}

}