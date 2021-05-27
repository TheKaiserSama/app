import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ILogro, IAlmacenLogro } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiLogroService {

	constructor(private http: HttpClient) { }

	getLogroByPk(id: number): Observable<ILogro> {
		return this.http.get<ILogro>(`/logros/${ id }`);
	}

	getLogros(limit: number, offset: number, searchTerm: string, idPlanDocente: number, grado: number, periodo: number, anioLectivo: number): Observable<IAlmacenLogro> {
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', searchTerm.toString());
		if (idPlanDocente) params = params.set('id_plan_docente', JSON.stringify(idPlanDocente));
		if (anioLectivo != null) params = params.set('anio_lectivo', JSON.stringify(anioLectivo));
		if (grado != null) params = params.set('grado', JSON.stringify(grado));
		if (periodo != null) params = params.set('periodo', JSON.stringify(periodo));
		return this.http.get<IAlmacenLogro>(`/logros`, { params: params });
	}

	getLogrosPorPlanDocente(idPlanDocente: number): Observable<ILogro[]> {
		return this.http.get<ILogro[]>(`/logros/${ idPlanDocente }/plan-docente`);
	}

	createLogros(logros: ILogro[]): Observable<ILogro[]> {
		return this.http.post<ILogro[]>(`/logros`, logros);
	}

	updateLogros(logros: ILogro[]): Observable<ILogro[]> {
		return this.http.put<ILogro[]>(`/logros`, logros);
	}

	destroyLogros(idLogrosToRemove: number[]): Observable<number> {
		let params = new HttpParams();
		params = params.set('id_logros_to_remove', JSON.stringify(idLogrosToRemove));
		return this.http.delete<number>(`/logros`, { params: params });
	}

	destroyLogrosByPlanDocente(id: number): Observable<number> {
		return this.http.delete<number>(`/logros/${ id }/plan-docente`);
	}

}
