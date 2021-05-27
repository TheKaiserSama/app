import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { VistaBoletinesAdministradorComponent } from '@modules/estadisticas/reportes/reportes-administrador/vista-boletines-administrador/vista-boletines-administrador.component';
import { VistaConsolidadosAdministradorComponent } from '@modules/estadisticas/reportes/reportes-administrador/vista-consolidados-administrador/vista-consolidados-administrador.component';
import { AsignarDirectorGrupoComponent } from '@modules/gestion-academica/directores-grupos/asignar-director-grupo/asignar-director-grupo.component';
import { AnioLectivoService } from '@services/anio-lectivo/anio-lectivo.service';
import { CursoService } from "@services/curso/curso.service";
import { DirectorGrupoService } from '@services/director-grupo/director-grupo.service';
import { SedeService } from '@services/sede/sede.service';
import { IAnioLectivo, ICurso, IDirectorGrupo, ISede } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-directores-grupo',
	templateUrl: './listar-directores-grupo.component.html',
	styleUrls: ['./listar-directores-grupo.component.scss']
})
export class ListarDirectoresGrupoComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	@Input() shouldPrint: boolean = false;
	@Input() botonElegirBoletin: boolean = false;
	@Input() botonElegirConsolidado: boolean = false;
	directoresGrupo$: Observable<IDirectorGrupo[]> = this.directorGrupoService.directoresGrupo$;
	collectionSize$: Observable<number> = this.directorGrupoService.collectionSize$;
	offset$: Observable<number> = this.directorGrupoService.offset$;
	ctrFilter: FormControl = new FormControl('');
	ctrSede: FormControl = new FormControl(null);
	ctrAnioLectivo: FormControl = new FormControl(null);
	ctrCurso: FormControl = new FormControl(null);
	sedes$: Observable<ISede[]> = this.sedeService.sedes$;
	aniosLectivos$: Observable<IAnioLectivo[]> = this.anioLectivoService.aniosLectivos$;
	cursos$: Observable<ICurso[]>;

	constructor(
		private anioLectivoService: AnioLectivoService,
		private cursoService: CursoService,
		private modalService: NgbModal,
		private sedeService: SedeService,
		public directorGrupoService: DirectorGrupoService,
	) { }

	ngOnInit(): void {
		this.sedeService.getSedes();
		this.anioLectivoService.getAniosLectivos();
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
			this.directorGrupoService.getDirectoresGrupo();
			this.cursos$ = of([]);
		}

		if (sede && sede.id && anioLectivo && anioLectivo.id) {
			this.cursos$ = this.cursoService.getCursosPorSedeAnioLectivo({ id_sede: sede.id, id_anio_lectivo: anioLectivo.id });
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
			this.cursos$ = this.cursoService.getCursosPorSedeAnioLectivo({ id_sede: sede.id, id_anio_lectivo: anioLectivo.id });
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
				this.directorGrupoService.searchTerm = searchTerm.toLowerCase();
				return this.directorGrupoService.requestApiDirectoresGrupo();
			}),
			takeUntil(this.unsubscribe),
		)
		.subscribe((directoresGrupo: IDirectorGrupo[]) => this.directorGrupoService.handleSubscribeDirectoresGrupo(directoresGrupo));
	}

}
