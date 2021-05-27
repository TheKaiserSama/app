import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IPeriodo, IAlmacenPeriodo } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiPeriodoService {

	constructor(private http: HttpClient) { }

	getPeriodoByPk(id: number): Observable<IPeriodo> {
		return this.http.get<IPeriodo>(`/periodos/${ id }`);
	}

	getPeriodos(limit: number, offset: number, numeroAnioLectivo?: number): Observable<IAlmacenPeriodo> {
		let params = new HttpParams();
		if (numeroAnioLectivo) params = params.set('numero_anio_lectivo', JSON.stringify(numeroAnioLectivo));
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		return this.http.get<IAlmacenPeriodo>(`/periodos`, { params: params });
	}
	
	getPeriodosPorAnioLectivo(id_anio_lectivo: number, numero?: number): Observable<IPeriodo[]> {
		let params = new HttpParams();
		if (numero) params = params.set('numero', JSON.stringify(numero));
		return this.http.get<IPeriodo[]>(`/periodos/anio_lectivo/${ id_anio_lectivo }`, { params: params });
	}

	createPeriodo(periodo: IPeriodo): Observable<boolean> {
		return this.http.post<boolean>(`/periodos`, periodo);
	}

	updatePeriodo(id: number, periodo: IPeriodo): Observable<any> {
		return this.http.put<any>(`/periodos/${ id }`, periodo);
	}

	destroyPeriodo(id: number): Observable<any> {
		return this.http.delete<any>(`/periodos/${ id }`);
	}

}
