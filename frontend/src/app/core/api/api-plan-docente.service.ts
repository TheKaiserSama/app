import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import { IAlmacenPlanDocente, ICurso, IMateria, IPlanDocente } from "@interfaces/all.interface";
import { getCurrentDate } from '@shared/helpers/transform';

@Injectable({
	providedIn: 'root'
})
export class ApiPlanDocenteService {

	constructor(private http: HttpClient) { }

	getPlanesDocente(idDocente: number, objParams: any = {}): Observable<IAlmacenPlanDocente> {
		const { limit = 10, offset = 0, search_term = '', id_anio_lectivo, id_curso, id_periodo } = objParams;
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', search_term);
		params = params.set('id_docente', idDocente.toString());
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		if (id_curso) params = params.set('id_curso', JSON.stringify(id_curso));
		if (id_periodo) params = params.set('id_periodo', JSON.stringify(id_periodo));
		return this.http.get<IAlmacenPlanDocente>(`/planes-docentes`, { params: params });
	}
	
	getPlanDocentePorCurso(id_curso: number, objParams: any = {}): Observable<IPlanDocente[]> {
		const { id_anio_lectivo, id_grado, id_persona } = objParams;
		let params = new HttpParams();
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		if (id_grado) params = params.set('id_grado', JSON.stringify(id_grado));
		if (id_persona) params = params.set('id_persona', JSON.stringify(id_persona));
		return this.http.get<IPlanDocente[]>(`/planes-docentes/curso/${ id_curso }`, { params: params });
	}

	getCursosPorDocente(id: number, objParams: any = {}): Observable<ICurso[]> {
		const { id_anio_lectivo } = objParams;
		let params = new HttpParams();
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		return this.http.get<ICurso[]>(`/planes-docentes/${ id }/cursos-docente`, { params: params });
	}

	getMateriasPorDocente(id: number, objParams: any = {}): Observable<IMateria[]> {
		const { id_anio_lectivo, id_curso } = objParams;
		let params = new HttpParams();
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		if (id_curso) params = params.set('id_curso', JSON.stringify(id_curso));
		return this.http.get<IMateria[]>(`/planes-docentes/${ id }/materias-docente`, { params: params });
	}

	getCursosPorPeriodo(objParams: any = {}): Observable<IPlanDocente[]> {
		const { id_docente, anio_actual = getCurrentDate(), fecha_inicio, fecha_finalizacion } = objParams;
		let params = new HttpParams();
		params = params.set('anio_actual', JSON.stringify(anio_actual));
		if (id_docente) params = params.set('id_docente', JSON.stringify(id_docente));
		if (fecha_inicio) params = params.set('fecha_inicio', JSON.parse(JSON.stringify(fecha_inicio)));
		if (fecha_finalizacion) params = params.set('fecha_finalizacion', JSON.parse(JSON.stringify(fecha_finalizacion)));
		return this.http.get<IPlanDocente[]>(`/planes-docentes/parametros-opcionales`, { params: params });
	}

	createPlanDocente(cargaAcademica: IPlanDocente): Observable<IPlanDocente> {
		return this.http.post<IPlanDocente>(`/planes-docentes`, cargaAcademica);
	}
	
	updatePlanDocente(cargaAcademica: IPlanDocente, id: number): Observable<IPlanDocente> {
		return this.http.put<IPlanDocente>(`/planes-docentes/${ id }`, cargaAcademica);
	}

	destroyPlanDocente(id: number): Observable<any> {
		return this.http.delete<any>(`/planes-docentes/${ id }`);
	}

}
