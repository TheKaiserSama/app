import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import {
	IGrado, IGrupo, ICurso, IAlmacenCurso, IGradoMateria, IAlmacenGradoMateria
} from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiCursoService {

	constructor(private http: HttpClient) { }

	getGradoByPk(id: number): Observable<IGrado> {
		return this.http.get<IGrado>(`/grados/${ id }`);
	}

	getGrados(objParams?: any): Observable<IGrado[]> {
		let params = new HttpParams();
		const { vigente } = objParams;
		if (vigente) params = params.set('vigente', JSON.stringify(vigente));
		return this.http.get<IGrado[]>('/grados', { params: params });
	}

	getGradosPorAnio(anio: number): Observable<IGrado[]> {
		return this.http.get<IGrado[]>(`/grados/anio/${ anio }`);
	}

	createGrado(grado: IGrado): Observable<boolean> {
		return this.http.post<boolean>('/grados', grado);
	}

	updateGrado(id: number, grado: IGrado): Observable<any> {
		return this.http.put<any>(`/grados/${ id }`, grado);
	}
	
	destroyGrado(id: number): Observable<any> {
		return this.http.delete<any>(`/grados/${ id }`)
	}

	getGrupoByPk(id: number): Observable<IGrupo> {
		return this.http.get<IGrupo>(`/grupos/${ id }`);
	}

	getGrupos(objParams?: any): Observable<IGrupo[]> {
		let params = new HttpParams();
		const { vigente } = objParams;
		if (vigente) params = params.set('vigente', JSON.stringify(vigente));
		return this.http.get<IGrupo[]>('/grupos', { params: params });
	}

	getGruposPorGrado(params: any): Observable<ICurso[]> {
		const { id_sede, id_anio_lectivo, id_grado } = params;
		return this.http.get<ICurso[]>(`/grados/${ id_sede }/${ id_grado }/${ id_anio_lectivo }/grupos`);
	}

	createGrupo(grupo: IGrupo): Observable<boolean> {
		return this.http.post<boolean>('/grupos', grupo);
	}

	updateGrupo(id: number, grupo: IGrupo): Observable<any> {
		return this.http.put<any>(`/grupos/${ id }`, grupo);
	}

	destroyGrupo(id: number): Observable<any> {
		return this.http.delete<any>(`/grupos/${ id }`)
	}

	getCursoByPk(id: number): Observable<ICurso> {
		return this.http.get<ICurso>(`/cursos/${ id }`);
	}

	getCursos(limit: number, offset: number, objParams?: any): Observable<IAlmacenCurso> {
		let params = new HttpParams();
		const { id_sede, id_anio_lectivo, id_grado, id_grupo } = objParams;
		if (id_sede) params = params.set('id_sede', JSON.stringify(id_sede));
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		if (id_grado) params = params.set('id_grado', JSON.stringify(id_grado));
		if (id_grupo) params = params.set('id_grupo', JSON.stringify(id_grupo));
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		return this.http.get<IAlmacenCurso>('/cursos', { params: params });
	}

	getCursosPorSede(curso: ICurso): Observable<IGrado[]> {
		const { id_sede, id_anio_lectivo } = curso;
		return this.http.get<IGrado[]>(`/cursos/${ id_sede }/${ id_anio_lectivo }`)
	}

	getCursosPorSedeAnioLectivo(curso: ICurso): Observable<ICurso[]> {
		const { id_sede, id_anio_lectivo } = curso;
		return this.http.get<ICurso[]>(`/cursos-por-sede/${ id_sede }/${ id_anio_lectivo }`)
	}

	createCurso(curso: ICurso): Observable<boolean> {
		return this.http.post<boolean>('/cursos', curso);
	}
	
	upadteCurso(id: number, curso: ICurso): Observable<any> {
		return this.http.put<any>(`/cursos/${ id }`, curso);
	}

	destroyCurso(id: number): Observable<any> {
		return this.http.delete<any>(`/cursos/${ id }`);
	}

	getGradoMateriaByPk(id: number): Observable<IGradoMateria> {
		return this.http.get<IGradoMateria>(`/grados-materias/${ id }`);
	}

	getGradosMaterias(limit: number, offset: number, objParams: any = {}): Observable<IAlmacenGradoMateria> {
		let params = new HttpParams();
		const { id_anio_lectivo, id_grado, search_term } = objParams;
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		if (id_grado) params = params.set('id_grado', JSON.stringify(id_grado));
		if (search_term) params = params.set('search_term', search_term);
		params = params.set('limit', JSON.stringify(limit));
		params = params.set('offset', JSON.stringify(offset));
		return this.http.get<IAlmacenGradoMateria>(`/grados-materias`, { params: params });
	}

	getGradosMateriasParams(id_anio_lectivo: number, id_grado: number): Observable<IGradoMateria[]> {
		return this.http.get<IGradoMateria[]>(`/grados-materias/${ id_anio_lectivo }/${ id_grado }`);
	}

	createGradoMateria(gradoMateria: IGradoMateria): Observable<boolean> {
		return this.http.post<boolean>(`/grados-materias`, gradoMateria);
	}

	updateGradoMateria(id: number, gradoMateria: IGradoMateria): Observable<any> {
		return this.http.put<any>(`/grados-materias/${ id }`, gradoMateria);
	}

	destroyGradoMateria(id: number): Observable<number> {
		return this.http.delete<number>(`/grados-materias/${ id }`);
	}

}
