import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotificacionEstudianteService } from '@services/notificacion-estudiante/notificacion-estudiante.service';
import { INotificacion } from '@interfaces/all.interface';

@Component({
	selector: 'app-notificacion-estudiante',
	templateUrl: './notificacion-estudiante.component.html',
	styleUrls: ['./notificacion-estudiante.component.scss']
})
export class NotificacionEstudianteComponent implements OnInit, OnDestroy {

	notificaciones$: Observable<INotificacion[]>;
	stylesNotificaciones: any = {};
	collectionSize$: Observable<number> = this.notificacionEstudianteService.collectionSize$;
	offset$: Observable<number> = this.notificacionEstudianteService.offset$;

	constructor(public notificacionEstudianteService: NotificacionEstudianteService) { }

	ngOnInit(): void {
		this.notificacionEstudianteService.getNotificacionesEstudiante();
		this.notificaciones$ = this.notificacionEstudianteService.notificaciones$.pipe(
		map((notificaciones: INotificacion[]) => {
			notificaciones.map((notificacion: INotificacion) => {
				this.stylesNotificaciones[notificacion.id] = true;
			});
			return notificaciones;
		}));
	}

	ngOnDestroy(): void {
		this.notificacionEstudianteService.initStateNotificacionesEstudiante();
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
		this.notificacionEstudianteService.pageSize = +value;
		this.notificacionEstudianteService.updateTablaNotificacionesEstudiante();
	}
	
	onPageChange(page: number): void {
		this.notificacionEstudianteService.page = page;
		this.notificacionEstudianteService.updateTablaNotificacionesEstudiante();
	}

	validateOffset(): number {
		return this.notificacionEstudianteService.validateOffset();
	}

}