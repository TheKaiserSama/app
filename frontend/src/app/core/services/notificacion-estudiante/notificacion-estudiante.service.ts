import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';

import { ApiEstudianteService } from '@api/api-estudiante.service';
import { ApiNotaService } from '@api/api-nota.service';
import { ApiNotificacionService } from '@api/api-notificacion.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { IAlmacenNotificacion, IEstudiante, INotaActividad, INotificacion } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class NotificacionEstudianteService {

	private _notificaciones$ = new BehaviorSubject<INotificacion[]>([]);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	notificaciones$: Observable<INotificacion[]> = this._notificaciones$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	page: number = 1;
	pageSize: number = 10;

	constructor(
		private apiEstudianteService: ApiEstudianteService,
		private apiNotaService: ApiNotaService,
		private apiNotificacionService: ApiNotificacionService,
		private authService: AuthenticationService,
	) { }

	getNotificacionesEstudiante(): void {
		this._loading$.next(true);
		const params = {
			limit: this.pageSize,
			offset: this._offset$.value
		};

		const { id_persona } = this.authService.currentUserValue;
		this.apiEstudianteService.getEstudianteByPkPersona(id_persona)
		.pipe(
			concatMap((estudiante: IEstudiante) => this.apiNotificacionService.getNotificacionesEstudiante(estudiante.id, params)),
			concatMap((response: IAlmacenNotificacion) => this.getNotaNotificaciones(response)),
			take(1)
		)
		.subscribe((notificaciones: INotificacion[]) => {
			this._loading$.next(false);
			this._notificaciones$.next(notificaciones);
		});
	}

	getNotaNotificaciones(response: IAlmacenNotificacion): Observable<INotificacion[]> {
		const { count, rows: notificaciones } = response;
		const arrayObs = [];
		this._collectionSize$.next(count);
		const newNotificaciones = notificaciones.map((notificacion: INotificacion, index: number) => {
			if (notificacion.actividad && notificacion.actividad.id) {
				arrayObs.push(this.apiNotaService.getOneEstudianteActividad(notificacion.estudiante.id, notificacion.actividad.id));
			}
			return { index: this._offset$.value + index + 1, ...notificacion };
		});

		if (arrayObs.length == 0) return of(newNotificaciones);
		return forkJoin(arrayObs).pipe(
			map((actividades: INotaActividad[]) => {
				for (let i = 0; i < notificaciones.length; i++) {
					const { estudiante, actividad } = notificaciones[i];
					const idx = actividades.findIndex((_actividad: INotaActividad) =>
					_actividad.id_estudiante == estudiante.id && _actividad.id_actividad == actividad?.id);
					if (idx > -1) {
						notificaciones[i]['nota_estudiante'] = actividades[idx];
					} else {
						notificaciones[i]['nota_estudiante'] = null;
					}
				}
				return notificaciones;
			})
		);
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaNotificacionesEstudiante(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getNotificacionesEstudiante();
	}

	initStateNotificacionesEstudiante(): void {
		this.page = 1;
		this.pageSize = 10;
		this._offset$.next(0);
	}

}
