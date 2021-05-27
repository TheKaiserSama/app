import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { IDocente, IAlmacenDocente } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiDocenteService {

	constructor(private http: HttpClient) { }

	getDocenteByPk(id: number): Observable<IDocente> {
		return this.http.get<IDocente>(`/docentes/${ id }`);
	}

	getDocentePorCodigo(codigo: string): Observable<IDocente> {
		return this.http.get<IDocente>(`/docentes/${ codigo }/codigo`);
	}

	getDocenteByPkPersona(idPersona: number): Observable<IDocente> {
		return this.http.get<IDocente>(`/docentes/${ idPersona }/persona`);
	}

	getDocentes(limit: number, offset: number, searchTerm: string): Observable<IAlmacenDocente> {
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('searchTerm', searchTerm.toString());
		return this.http.get<IAlmacenDocente>(`/docentes`, { params: params });
	}

	getDocentesNoDirectoresGrupo(queryParams: any): Observable<any> {
		let params = new HttpParams();
		params = params.set('page', JSON.stringify(queryParams.page));
		params = params.set('size', JSON.stringify(queryParams.size));
		return this.http.get<any>(`/docentes/no-directores-grupo`, { params });
	}

	getCountDocentes(): Observable<number> {
		return this.http.get<number>(`/docentes/count`);
	}

	createDocente(docente: IDocente): Observable<IDocente> {
		return this.http.post<IDocente>(`/docentes`, docente);
	}

	updateDocente(docente: IDocente): Observable<IDocente> {
		return this.http.put<IDocente>(`/docentes/${ docente.id }`, docente);
	}

	destroyDocente(id: number): Observable<any> {
		return this.http.delete<any>(`/docentes/${ id }`);
	}

}
