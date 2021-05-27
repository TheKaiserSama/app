import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMatricula, IAlmacenMatricula } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiMatriculaService {

	constructor(private http: HttpClient) { }

	getMatriculas(limit: number, offset: number, searchTerm: string, idGrado: number, idGrupo: number, idAnioLectivo: number, vigente: boolean): Observable<IAlmacenMatricula> {
		const _vigente = vigente ? JSON.stringify(vigente) : '';
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', searchTerm);
		params = params.set('vigente', _vigente);
		if (idAnioLectivo) params = params.set('id_anio_lectivo', JSON.stringify(idAnioLectivo));
		if (idGrado) params = params.set('id_grado', JSON.stringify(idGrado));
		if (idGrupo) params = params.set('id_grupo', JSON.stringify(idGrupo));
		return this.http.get<IAlmacenMatricula>(`/matriculas`, { params: params });
	}

	getMatriculasByIdEstudiante(id: number): Observable<IMatricula[]> {
		return this.http.get<IMatricula[]>(`/matriculas/${ id }/estudiante`);
	}

	getMatriculaByIdCurso(id: number): Observable<IMatricula[]> {
		return this.http.get<IMatricula[]>(`/matriculas/curso/${ id }`);
	}

	getCountMatriculasPorSede(): Observable<any> {
		return this.http.get(`/matriculas/count-matriculas-por-sede`);
	}

	getCountMatriculasUltimosAnios(): Observable<number[]> {
		return this.http.get<number[]>(`/matriculas/count-matriculas-ultimos-anios`);
	}

	createMatricula(matricula: IMatricula): Observable<IMatricula> {
		return this.http.post<IMatricula>(`/matriculas`, matricula);
	}

	updateMatricula(data: any): Observable<IMatricula> {
		return this.http.put<IMatricula>(`/matriculas`, data);
	}

	destroyMatricula(id: number): Observable<boolean> {
		return this.http.delete<boolean>(`/matriculas/${ id }`);
	}

}
