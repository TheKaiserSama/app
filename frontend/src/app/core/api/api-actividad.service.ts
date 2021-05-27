import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAlmacenActividad, IActividad } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiActividadService {

	constructor(private http: HttpClient) { }

	getActividades(limit: number, offset: number, searchTerm: string, id_logro: number): Observable<IAlmacenActividad> {
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', searchTerm.toString());
		params = params.set('id_logro', id_logro.toString());
		return this.http.get<IAlmacenActividad>(`/actividades/logro`, { params: params });
	}

	getActividadesPorLogro(idLogro: number): Observable<IActividad[]> {
		return this.http.get<IActividad[]>(`/actividades/logro/${ idLogro }`);
	}

	createActividades(actividades: IActividad[]): Observable<IActividad[]> {
		return this.http.post<IActividad[]>(`/actividades`, actividades);
	}

	updateActividades(actividades: IActividad[]): Observable<IActividad[]> {
		return this.http.put<IActividad[]>(`/actividades`, actividades);
	}

	destroyActividades(idActividadesToRemove: number[]): Observable<number> {
		let params = new HttpParams();
		params = params.set('id_actividades_to_remove', JSON.stringify(idActividadesToRemove));
		return this.http.delete<number>(`/actividades`, { params: params });
	}

	destroyActividadesByIdLogro(id: number): Observable<number> {
		return this.http.delete<number>(`/actividades/logro/${ id }`);
	}

}
