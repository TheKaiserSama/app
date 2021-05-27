import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IInasistencia, IAlmacenInasistencia } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiInasistenciaService {

	constructor(private http: HttpClient) { }

	getInasistenciaByPk(id: number): Observable<IInasistencia> {
		return this.http.get<IInasistencia>(`/inasistencias/${ id }`);
	}

	getInasistenciasDocente(id: number, objParams: any = {}): Observable<IAlmacenInasistencia> {
		const { limit = 10, offset = 0, id_sede = null, id_anio_lectivo = null, id_curso = null, id_materia = null, search_term = '' } = objParams;
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', search_term);
		if (id) params = params.set('id_docente', JSON.stringify(id));
		if (id_sede) params = params.set('id_sede', id_sede);
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', id_anio_lectivo);
		if (id_curso) params = params.set('id_curso', id_curso);
		if (id_materia) params = params.set('id_materia', id_materia);

		return this.http.get<IAlmacenInasistencia>(`/inasistencias/${ id }/docente`, { params: params });
	}

	getInasistenciasEstudiante(id: number, objParams: any = {}): Observable<IAlmacenInasistencia> {
		const { limit = 10, offset = 0, id_sede = null, id_anio_lectivo = null, id_curso = null, id_materia = null, search_term = '' } = objParams;
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', search_term);
		if (id) params = params.set('id_estudiante', JSON.stringify(id));
		if (id_sede) params = params.set('id_sede', id_sede);
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', id_anio_lectivo);
		if (id_curso) params = params.set('id_curso', id_curso);
		if (id_materia) params = params.set('id_materia', id_materia);

		return this.http.get<IAlmacenInasistencia>(`/inasistencias/${ id }/estudiante`, { params: params });
	}
	
	getInasistenciaByParams(objParams = {}): Observable<IInasistencia[]> {
		let params = new HttpParams();
		for (const property in objParams) {
			params = params.set(property, objParams[property]);
		}
		return this.http.get<IInasistencia[]>(`/inasistencias`, { params: params });
	}

	createInasistencias(inasistencias: IInasistencia[], objParams: any =  {}): Observable<any> {
		return this.http.post(`/inasistencias-coleccion`, { inasistencias, objParams });
	}

}
