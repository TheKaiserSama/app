import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import {
	IBoletin,
	IBoletinFinal,
	ICreateUpdateBoletin,
	IMatricula,
	IPrintBoletin,
	IValoracionCualitativa
} from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiBoletinService {

	constructor(private http: HttpClient) { }

	getValoracionesFormativas(valFormativaparams: any = {}): Observable<IValoracionCualitativa[]> {
		const { id_boletin } = valFormativaparams;
		let params = new HttpParams();
		if (id_boletin) params = params.set('id_boletin', JSON.stringify(id_boletin));
		return this.http.get<IValoracionCualitativa[]>(`/boletines/valoraciones-formativas`, { params: params });
	}

	getNotasBoletinPorPeriodo(id_estudiante: number, objParams: any = {}): Observable<IBoletinFinal[]> {
		const { id_curso, id_grado, id_periodo } = objParams;
		let params = new HttpParams();
		params = params.set('id_curso', JSON.stringify(id_curso));
		params = params.set('id_grado', JSON.stringify(id_grado));
		params = params.set('id_periodo', JSON.stringify(id_periodo));
		return this.http.get<IBoletinFinal[]>(`/boletines/notas-por-periodo/${id_estudiante}`, { params: params });
	}

	getNotasBoletinFinal(id_estudiante: number, matricula: IMatricula): Observable<IBoletinFinal[]> {
		const { curso, id_curso } = matricula;
		const { id_grado } = curso;
		let params = new HttpParams();
		params = params.set('id_curso', JSON.stringify(id_curso));
		params = params.set('id_grado', JSON.stringify(id_grado));
		return this.http.get<IBoletinFinal[]>(`/boletines/notas-finales/${id_estudiante}`, { params: params });
	}

	getBoletinesPorPeriodo(objParams: any = {}): Observable<IBoletin[]> {
		const { id_anio_lectivo, id_curso, id_director_grupo, id_periodo } = objParams;
		let params = new HttpParams();
		if (id_anio_lectivo) params = params.set('id_anio_lectivo', JSON.stringify(id_anio_lectivo));
		if (id_curso) params = params.set('id_curso', JSON.stringify(id_curso));
		if (id_director_grupo) params = params.set('id_director_grupo', JSON.stringify(id_director_grupo));
		if (id_periodo) params = params.set('id_periodo', JSON.stringify(id_periodo));

		return this.http.get<IBoletin[]>(`/boletines/boletines-por-periodo`, { params: params });
	}

	createBoletin(infoBoletin: ICreateUpdateBoletin): Observable<boolean> {
		return this.http.post<boolean>(`/boletines`, infoBoletin);
	}

	updateBoletin(id: number, infoBoletin: ICreateUpdateBoletin): Observable<any> {
		return this.http.put<any>(`/boletines/${ id }`, infoBoletin);
	}

	destroyBoletin(id: number): Observable<any> {
		return this.http.delete<any>(`/boletines/${id}`);
	}

	printOneBoletin(id_estudiante: number, objParams: any = {}): Observable<IPrintBoletin> {
		const { id_boletin, id_curso, id_docente, id_grado } = objParams;
		let params = new HttpParams();
		params = params.set('id_boletin', JSON.stringify(id_boletin));
		params = params.set('id_curso', JSON.stringify(id_curso));
		params = params.set('id_docente', JSON.stringify(id_docente));
		params = params.set('id_grado', JSON.stringify(id_grado));
		if ('id_periodo' in objParams) params = params.set('id_periodo', JSON.stringify(objParams.id_periodo));
		return this.http.get<IPrintBoletin>(`/boletines/imprimir-uno/${id_estudiante}`, { params });
	}

	printBoletines(query: any = {}): Observable<IPrintBoletin[]> {
		let params = new HttpParams();
		params = params.set('print_boletines', encodeURIComponent(JSON.stringify(query)));
		return this.http.get<IPrintBoletin[]>(`/boletines/imprimir-todos`, { params });
	}

	private getParams(query: any): HttpParams {
		let params: HttpParams = new HttpParams();
		for (const key of Object.keys(query)) {
			if (query[key]) {
				if (query[key] instanceof Array) {
					query[key].forEach((item) => {
						params = params.append(`${key.toString()}[]`, item);
					});
				} else {
					params = params.append(key.toString(), query[key]);
				}
			}
		}
		return params;
	}
	
}
