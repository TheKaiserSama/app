import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { INotificacion, IAlmacenNotificacion } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiNotificacionService {

	constructor(private http: HttpClient) { }

	getNotificacionesEstudiante(id: number, objParams: any = {}): Observable<IAlmacenNotificacion> {
		const { limit = 10, offset = 0 } = objParams;
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());

		return this.http.get<IAlmacenNotificacion>(`/notificaciones/${ id }/estudiante`, { params: params });
	}

	getNotificacionesDocente(id: number, objParams: any = {}): Observable<IAlmacenNotificacion> {
		const { limit = 10, offset = 0, id_sede = null, id_anio_lectivo = null, id_curso = null, search_term = '' } = objParams;
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', search_term);
		if (id_sede) params = params.set('id_sede', id_sede);
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', id_anio_lectivo);
		if (id_curso) params = params.set('id_curso', id_curso);

		return this.http.get<IAlmacenNotificacion>(`/notificaciones/${ id }/docente`, { params: params });
	}

	getUltimasNotificaciones(id_estudiante: number): Observable<INotificacion[]> {
		return this.http.get<INotificacion[]>(`/notificaciones/${ id_estudiante }/ultimas_notificaciones`);
	}

	updateNotificacion(id: number, notificacion: INotificacion): Observable<any> {
		return this.http.put<any>(`/notificaciones/${ id }`, notificacion);
	}

}
