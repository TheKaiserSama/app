import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';

import { IEstudiante, INotaLogro, ICurso, INotaActividad, IListNotas } from '@shared/interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiNotaService {

	constructor(private http: HttpClient) { }

	getOneEstudianteActividad(idEstudiante: number, idActividad: number): Observable<INotaActividad> {
		let params = new HttpParams();
		params = params.set('id_estudiante', idEstudiante.toString());
		params = params.set('id_actividad', idActividad.toString());
		return this.http.get<INotaActividad>(`/notas-actividades/${ idEstudiante }/${ idActividad }`);
	}

	getNotasMasAltas(id_actividad: number): Observable<IEstudiante[]> {
		let params = new HttpParams();
		params = params.set('id_actividad', id_actividad.toString());
		return this.http.get<IEstudiante[]>('/notas-actividades/maxima', { params: params });
	}

	getNotasMasBajas(id_actividad: number): Observable<IEstudiante[]> {
		let params = new HttpParams();
		params = params.set('id_actividad', id_actividad.toString());
		return this.http.get<IEstudiante[]>('/notas-actividades/minima', { params: params });
	}

	getNotaPromedio(id_actividad: number): Observable<any> {
		let params = new HttpParams();
		params = params.set('id_actividad', id_actividad.toString());
		return this.http.get<any>('/notas-actividades/promedio', { params: params });
	}

	getNotasActividadesPorLogro(curso: ICurso, id_logro: number): Observable<any> {
		let params = new HttpParams();
		params = params.set('curso', JSON.stringify(curso));
		return this.http.get<any>(`/logros/${ id_logro }/notas-actividades`, { params: params });
	}

	getNotasPorLogros(curso: ICurso, idPlanDocente: number): Observable<any> {
		let params = new HttpParams();
		params = params.set('curso', JSON.stringify(curso));
		params = params.set('id_plan_docente', JSON.stringify(idPlanDocente));
		return this.http.get<any>(`/logros/${ idPlanDocente }/notas-logros`, { params: params });
	}

	createNotasActividad(data: any /*notas: INotaActividad[]*/): Observable<IListNotas> {
		return this.http.post<IListNotas>(`/notas-actividades`, data);
	}

	createNotasLogro(curso: ICurso, id_logro: number): Observable<INotaLogro[]> {
		let params = new HttpParams();
		params = params.set('curso', JSON.stringify(curso));
		params = params.set('id_logro', id_logro.toString());
		return this.http.post<INotaLogro[]>('/notas-logros', { }, { params: params });
	}

}
