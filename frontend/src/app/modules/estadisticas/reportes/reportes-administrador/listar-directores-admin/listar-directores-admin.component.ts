import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { VistaBoletinesAdministradorComponent } from '../vista-boletines-administrador/vista-boletines-administrador.component';
import { VistaConsolidadosAdministradorComponent } from '../vista-consolidados-administrador/vista-consolidados-administrador.component';
import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiInstitucionService } from '@api/api-institucion.service';
import { DirectorGrupoAdminService } from '@services/director-grupo-admin/director-grupo-admin.service';
import { IAnioLectivo, ICurso, IDirectorGrupo, ISede } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-directores-admin',
	templateUrl: './listar-directores-admin.component.html',
	styleUrls: ['./listar-directores-admin.component.scss']
})
export class ListarDirectoresAdminComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	@Input() botonElegirBoletin: boolean = false;
	@Input() botonElegirConsolidado: boolean = false;
	directoresGrupo$: Observable<IDirectorGrupo[]> = this.directorGrupoAdminService.directoresGrupo$;
	collectionSize$: Observable<number> = this.directorGrupoAdminService.collectionSize$;
	offset$: Observable<number> = this.directorGrupoAdminService.offset$;
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
		public directorGrupoAdminService: DirectorGrupoAdminService,
	) { }

	ngOnInit(): void {
		this.sedes$ = this.apiInstitucionService.getSedes();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.getDirectoresGrupoFilter();
		this.directorGrupoAdminService.getDirectoresGrupo();
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	onChangePageSize(value: string): void {
		this.directorGrupoAdminService.pageSize = +value;
		this.directorGrupoAdminService.updateTablaDirectoresGrupo();
	}
	
	onPageChange(page: number): void {
		this.directorGrupoAdminService.page = page;
		this.directorGrupoAdminService.updateTablaDirectoresGrupo();
	}

	validateOffset(): number {
		return this.directorGrupoAdminService.validateOffset();
	}

	handleSede(sede: ISede): void {
		const anioLectivo = this.ctrAnioLectivo.value;
		this.ctrCurso.setValue(null);
		
		if (sede && sede.id) {
			this.directorGrupoAdminService.params.id_sede = sede.id;
			this.directorGrupoAdminService.getDirectoresGrupo();
		} else {
			this.directorGrupoAdminService.params.id_sede = null;
			this.directorGrupoAdminService.getDirectoresGrupo();
			this.cursos$ = of([]);
		}

		if (sede && sede.id && anioLectivo && anioLectivo.id) {
			this.cursos$ = this.apiCursoService.getCursosPorSedeAnioLectivo({ id_sede: sede.id, id_anio_lectivo: anioLectivo.id });
			this.directorGrupoAdminService.params.id_sede = sede.id;
			this.directorGrupoAdminService.params.id_anio_lectivo = anioLectivo.id;
			this.directorGrupoAdminService.getDirectoresGrupo();
		}
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		const sede = this.ctrSede.value;
		this.ctrCurso.setValue(null);
		
		if (anioLectivo && anioLectivo.id) {
			this.directorGrupoAdminService.params.id_anio_lectivo = anioLectivo.id;
			this.directorGrupoAdminService.getDirectoresGrupo();
		} else {
			this.directorGrupoAdminService.params.id_anio_lectivo = null;
			this.directorGrupoAdminService.getDirectoresGrupo();
			this.cursos$ = of([]);
		}

		if (sede && sede.id && anioLectivo && anioLectivo.id) {
			this.cursos$ = this.apiCursoService.getCursosPorSedeAnioLectivo({ id_sede: sede.id, id_anio_lectivo: anioLectivo.id });
			this.directorGrupoAdminService.params.id_sede = sede.id;
			this.directorGrupoAdminService.params.id_anio_lectivo = anioLectivo.id;
			this.directorGrupoAdminService.getDirectoresGrupo();
		}
	}

	handleCurso(curso: ICurso): void {
		if (curso && curso.id) {
			this.directorGrupoAdminService.params.id_curso = curso.id;
			this.directorGrupoAdminService.getDirectoresGrupo();
		} else {
			this.directorGrupoAdminService.params.id_curso = null;
			this.directorGrupoAdminService.getDirectoresGrupo();
		}
	}

	loadCursoDirectorGrupo(directorGrupo: IDirectorGrupo): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		const modalRef = this.modalService.open(VistaBoletinesAdministradorComponent, modalOptions);
		modalRef.componentInstance.directorGrupo = directorGrupo;
	}

	loadConsolidadosPorDirector(directorGrupo: IDirectorGrupo): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		const modalRef = this.modalService.open(VistaConsolidadosAdministradorComponent, modalOptions);
		modalRef.componentInstance.directorGrupo = directorGrupo;
	}

	private getDirectoresGrupoFilter(): void {
		this.ctrFilter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.directorGrupoAdminService.searchTerm = searchTerm.toLowerCase();
				return this.directorGrupoAdminService.requestApiDirectoresGrupo();
			}),
			takeUntil(this.unsubscribe),
		)
		.subscribe((directoresGrupo: IDirectorGrupo[]) =>
		this.directorGrupoAdminService.handleSubscribeDirectoresGrupo(directoresGrupo));
	}

}
