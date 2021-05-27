import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { AsignarDirectorGrupoComponent } from '../asignar-director-grupo/asignar-director-grupo.component';
import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiInstitucionService } from '@api/api-institucion.service';
import { DirectorGrupoService } from '@services/director-grupo/director-grupo.service';
import { IAnioLectivo, ICurso, IDirectorGrupo, ISede } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-directores-grupo-admin',
	templateUrl: './listar-directores-grupo-admin.component.html',
	styleUrls: ['./listar-directores-grupo-admin.component.scss']
})
export class ListarDirectoresGrupoAdminComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	directoresGrupo$: Observable<IDirectorGrupo[]> = this.directorGrupoService.directoresGrupo$;
	collectionSize$: Observable<number> = this.directorGrupoService.collectionSize$;
	offset$: Observable<number> = this.directorGrupoService.offset$;
	ctrFilter: FormControl = new FormControl('');
	ctrSede: FormControl = new FormControl(null);
	ctrAnioLectivo: FormControl = new FormControl(null);
	ctrCurso: FormControl = new FormControl(null);
	sedes$: Observable<ISede[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	cursos$: Observable<ICurso[]>;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		private apiInstitucionService: ApiInstitucionService,
		private modalService: NgbModal,
		public directorGrupoService: DirectorGrupoService,
	) { }

	ngOnInit(): void {
		this.sedes$ = this.apiInstitucionService.getSedes();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.getDirectoresGrupoFilter();
		this.directorGrupoService.getDirectoresGrupo();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	asignarDirector(): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		this.modalService.open(AsignarDirectorGrupoComponent, modalOptions);
	}

	onChangePageSize(value: string): void {
		this.directorGrupoService.pageSize = +value;
		this.directorGrupoService.updateTablaDirectoresGrupo();
	}
	
	onPageChange(page: number): void {
		this.directorGrupoService.page = page;
		this.directorGrupoService.updateTablaDirectoresGrupo();
	}

	validateOffset(): number {
		return this.directorGrupoService.validateOffset();
	}

	handleSede(sede: ISede): void {
		const anioLectivo = this.ctrAnioLectivo.value;
		this.ctrCurso.setValue(null);
		
		if (sede && sede.id) {
			this.directorGrupoService.params.id_sede = sede.id;
			this.directorGrupoService.getDirectoresGrupo();
		} else {
			this.directorGrupoService.params.id_sede = null;
			this.cursos$ = of([]);
			this.directorGrupoService.getDirectoresGrupo();
		}
		if (sede && sede.id && anioLectivo && anioLectivo.id) {
			this.cursos$ = this.apiCursoService.getCursosPorSedeAnioLectivo({ id_sede: sede.id, id_anio_lectivo: anioLectivo.id });
			this.directorGrupoService.params.id_sede = sede.id;
			this.directorGrupoService.params.id_anio_lectivo = anioLectivo.id;
			this.directorGrupoService.getDirectoresGrupo();
		}
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		const sede = this.ctrSede.value;
		this.ctrCurso.setValue(null);
		
		if (anioLectivo && anioLectivo.id) {
			this.directorGrupoService.params.id_anio_lectivo = anioLectivo.id;
			this.directorGrupoService.getDirectoresGrupo();
		} else {
			this.directorGrupoService.params.id_anio_lectivo = null;
			this.directorGrupoService.getDirectoresGrupo();
			this.cursos$ = of([]);
		}

		if (sede && sede.id && anioLectivo && anioLectivo.id) {
			this.cursos$ = this.apiCursoService.getCursosPorSedeAnioLectivo({ id_sede: sede.id, id_anio_lectivo: anioLectivo.id });
			this.directorGrupoService.params.id_sede = sede.id;
			this.directorGrupoService.params.id_anio_lectivo = anioLectivo.id;
			this.directorGrupoService.getDirectoresGrupo();
		}
	}

	handleCurso(curso: ICurso): void {
		if (curso && curso.id) {
			this.directorGrupoService.params.id_curso = curso.id;
			this.directorGrupoService.getDirectoresGrupo();
		} else {
			this.directorGrupoService.params.id_curso = null;
			this.directorGrupoService.getDirectoresGrupo();
		}
	}

	private getDirectoresGrupoFilter(): void {
		this.ctrFilter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.directorGrupoService.searchTerm = searchTerm.toLowerCase();
				return this.directorGrupoService.requestApiDirectoresGrupo();
			}),
			takeUntil(this.unsubscribe),
		)
		.subscribe((directoresGrupo: IDirectorGrupo[]) =>
		this.directorGrupoService.handleSubscribeDirectoresGrupo(directoresGrupo));
	}

}
