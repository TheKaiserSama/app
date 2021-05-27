import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import { IAlmacenDirectorGrupo, ICurso, IDirectorGrupo } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiDirectorGrupoService {

	constructor(private http: HttpClient) { }

	getDirectoresGrupo(objParams: any = {}): Observable<IAlmacenDirectorGrupo> {
		const { limit = 10, offset = 0, search_term = '', id_sede, id_anio_lectivo, id_curso } = objParams;
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', search_term);
		if (id_sede) params = params.set('id_sede', JSON.stringify(id_sede));
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		if (id_curso) params = params.set('id_curso', JSON.stringify(id_curso));
		return this.http.get<IAlmacenDirectorGrupo>(`/directores-grupo`, { params: params });
	}

	getDirectoresPorAnioLectivo(objParams: any = {}): Observable<IDirectorGrupo[]> {
		const { id_anio_lectivo } = objParams;
		return this.http.get<IDirectorGrupo[]>(`/directores-grupo/${ id_anio_lectivo }/directores-cursos`);
	}

	getCursosAsignadosADirector(id: number, objParams: any = {}): Observable<ICurso[]> {
		const { id_anio_lectivo } = objParams;
		let params = new HttpParams();
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		return this.http.get<ICurso[]>(`/directores-grupo/${ id }/cursos-asignados`, { params: params });
	}

	createDirectorGrupo(directorGrupo: IDirectorGrupo): Observable<boolean> {
		return this.http.post<boolean>(`/directores-grupo`, directorGrupo);
	}

	destroyDirectorGrupo(id: number): Observable<number> {
		return this.http.delete<number>(`/directores-grupo/${ id }`);
	}
	
}
