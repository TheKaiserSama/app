import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import { IConsolidadoDatos, ICreateUpdateConsolidado } from '@interfaces/consolidado.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiConsolidadoService {

	constructor(private http: HttpClient) { }

	getConsolidadoPorPeriodo(objParams: any): Observable<IConsolidadoDatos> {
		const { id_anio_lectivo, id_curso, id_director_grupo, id_grado, id_periodo } = objParams;
		let params = new HttpParams();
		params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		params = params.set('id_curso', JSON.stringify(id_curso));
		params = params.set('id_director_grupo', JSON.stringify(id_director_grupo));
		params = params.set('id_grado', JSON.stringify(id_grado));
		params = params.set('id_periodo', JSON.stringify(id_periodo));
		return this.http.get<IConsolidadoDatos>(`/consolidados/consolidado-por-periodo`, { params });
	}

	getConsolidadoFinal(objParams: any): Observable<IConsolidadoDatos> {
		const { id_anio_lectivo, id_curso, id_director_grupo, id_grado } = objParams;
		let params = new HttpParams();
		params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		params = params.set('id_curso', JSON.stringify(id_curso));
		params = params.set('id_director_grupo', JSON.stringify(id_director_grupo));
		params = params.set('id_grado', JSON.stringify(id_grado));
		return this.http.get<IConsolidadoDatos>(`/consolidados/consolidado-final`, { params });
	}

	createConsolidado(infoConsolidado: ICreateUpdateConsolidado): Observable<boolean> {
		return this.http.post<boolean>(`/consolidados`, infoConsolidado);
	}

	updateConsolidado(id: number, infoConsolidado: ICreateUpdateConsolidado): Observable<any> {
		return this.http.put<any>(`/consolidados/${ id }`, infoConsolidado);
	}
	
}
