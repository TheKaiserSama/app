import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { concatMap, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiInstitucionService } from '@api/api-institucion.service';
import { ApiPlanDocenteService } from '@api/api-plan-docente.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { NotificacionDocenteService } from '@services/notificacion-docente/notificacion-docente.service';
import { IAnioLectivo, ICurso, IDocente, INotificacion, ISede } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-notificacion-docente',
	templateUrl: './notificacion-docente.component.html',
	styleUrls: ['./notificacion-docente.component.scss']
})
export class NotificacionDocenteComponent implements OnInit, OnDestroy {

	notificaciones$: Observable<INotificacion[]>;
	stylesNotificaciones: any = {};
	collectionSize$: Observable<number> = this.notificacionDocenteService.collectionSize$;
	offset$: Observable<number> = this.notificacionDocenteService.offset$;
	sedes$: Observable<ISede[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	cursos$: Observable<ICurso[]>;
	ctrFilter: FormControl = new FormControl('');
	ctrSede: FormControl = new FormControl(null);
	ctrAnioLectivo: FormControl = new FormControl(null);
	ctrCurso: FormControl = new FormControl(null);
	docente: IDocente = this.authService.currentUserValue.docente;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiInstitucionService: ApiInstitucionService,
		private apiPlanDocenteService: ApiPlanDocenteService,
		private authService: AuthenticationService,
		public notificacionDocenteService: NotificacionDocenteService,
	) { }

	ngOnInit(): void {
		this.notificacionDocenteService.getNotificacionesDocente();
		this.getNotificacionesFilter();
		this.notificaciones$ = this.notificacionDocenteService.notificaciones$
		.pipe(
			map((notificaciones: INotificacion[]) => {
				notificaciones.map((notificacion: INotificacion) => {
					this.stylesNotificaciones[notificacion.id] = true;
				});
				return notificaciones;
			})
		);
		this.sedes$ = this.apiInstitucionService.getSedes();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.cursos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear())
		.pipe(
			concatMap((anioLectivo: IAnioLectivo) => 
			this.apiPlanDocenteService.getCursosPorDocente(this.docente.id, { id_anio_lectivo: anioLectivo.id }))
		);
	}

	ngOnDestroy(): void {
		this.notificacionDocenteService.initStateNotificacionesDocente();
	}

	getClass(id: number): any {
		return { 'fa-chevron-right': this.stylesNotificaciones[id], 'fa-chevron-down': !this.stylesNotificaciones[id] };
	}

	changeStyle(id: number): void {
		for (let key in this.stylesNotificaciones) {
			if (key == id.toString()) {
				this.stylesNotificaciones[key] = !this.stylesNotificaciones[key];
				return;
			}
		}
	}

	onChange(value: string): void {
		this.notificacionDocenteService.pageSize = +value;
		this.notificacionDocenteService.updateTablaNotificacionesDocente();
	}
	
	onPageChange(page: number): void {
		this.notificacionDocenteService.page = page;
		this.notificacionDocenteService.updateTablaNotificacionesDocente();
	}

	validateOffset(): number {
		return this.notificacionDocenteService.validateOffset();
	}

	handleSede(sede: ISede): void {
		if (sede && sede.id)
			this.notificacionDocenteService.objParams.id_sede = sede.id;
		else
			this.notificacionDocenteService.objParams.id_sede = null
		this.notificacionDocenteService.updateTablaNotificacionesDocente();
	}

	handleAnioLectivo(anioLectivo: IAnioLectivo): void {
		this.ctrCurso.setValue(null, { emitViewToModelChange: false });
		this.notificacionDocenteService.objParams.id_curso = null;
		if (anioLectivo && anioLectivo.id) {
			this.notificacionDocenteService.objParams.id_anio_lectivo = anioLectivo.id;
			this.cursos$ = this.apiPlanDocenteService.getCursosPorDocente(this.docente.id, { id_anio_lectivo: anioLectivo.id });
		} else {
			this.notificacionDocenteService.objParams.id_anio_lectivo = null;
			this.cursos$ = of([]);
		}
		this.notificacionDocenteService.updateTablaNotificacionesDocente();
	}

	handleCurso(curso: ICurso): void {
		if (curso && curso.grado && curso.grupo)
			this.notificacionDocenteService.objParams.id_curso = curso.id;
		else
			this.notificacionDocenteService.objParams.id_curso = null;
		this.notificacionDocenteService.updateTablaNotificacionesDocente();
	}

	private getNotificacionesFilter(): void {
		this.ctrFilter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.notificacionDocenteService.objParams.search_term = searchTerm.toLowerCase();
				return this.notificacionDocenteService.requestApiNotificacionesDocente();
            })
		)
		.subscribe((notificaciones: INotificacion[]) =>
		this.notificacionDocenteService.handleSubscribeNotificacionesDocente(notificaciones));
	}

}