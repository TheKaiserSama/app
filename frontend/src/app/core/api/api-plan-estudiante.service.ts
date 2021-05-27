import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';

import { IPlanEstudiante } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiPlanEstudianteService {

	constructor(private http: HttpClient) { }

	// getPlanEstudiantePorEstudiante
	getMateriasPorEstudiante(idEstudiante: number, objParams: any): Observable<IPlanEstudiante> {
		const { idPeriodo, idMateria, idAnioLectivo } = objParams;
		let params = new HttpParams();
		params = params.set('id_periodo', JSON.stringify(idPeriodo));
		params = params.set('id_materia', JSON.stringify(idMateria));
		params = params.set('id_anio_lectivo', JSON.stringify(idAnioLectivo));
		return this.http.get<IPlanEstudiante>(`/planes-estudiantes/${ idEstudiante }`, { params: params });
	}

}
