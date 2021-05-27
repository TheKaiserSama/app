import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { IValoracionFormativa } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiValoracionFormativaService {

	constructor(private http: HttpClient) { }

	getValoracionesFormativas(objParams: any = {}): Observable<IValoracionFormativa[]> {
		let params = new HttpParams();
		if ('vigente' in objParams) params = params.set('vigente', JSON.stringify(objParams.vigente));

		return this.http.get<IValoracionFormativa[]>(`/valoraciones-formativas`, { params });
	}

	createValoracionFormativa(valoracionFormativa: IValoracionFormativa): Observable<any> {
		return this.http.post(`/valoraciones-formativas`, valoracionFormativa);
	}

	updateValoracionFormativa(id: number, valoracionFormativa: IValoracionFormativa): Observable<any> {
		return this.http.put<any>(`/valoraciones-formativas/${ id }`, valoracionFormativa);
	}

	destroyValoracionFormativa(id: number): Observable<any> {
		return this.http.delete<any>(`/valoraciones-formativas/${ id }`);
	}

}
