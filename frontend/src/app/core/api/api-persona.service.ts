import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IPersona, IAlmacenPersona, IEstudiante } from '@interfaces/all.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiPersonaService {

  constructor(private http: HttpClient) { }

	getPersonaByPk(id: number): Observable<IPersona> {
		return this.http.get<IPersona>(`/personas/${ id }`);
	}

	getPersonas(limit: number, offset: number, searchTerm: string, idRol: number):
	Observable<IAlmacenPersona> {
		const id_rol = idRol ? JSON.stringify(idRol) : '';
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', searchTerm);
		params = params.set('id_rol', id_rol);
		return this.http.get<IAlmacenPersona>(`/personas`, { params: params });
	}

	getPersonaPorNumeroDocumento(documento: string, objParams: any = {}): Observable<IPersona> {
		const { id } = objParams;
		let params = new HttpParams();
		if (id) params = params.set('id', JSON.stringify(id));
		return this.http.get<IPersona>(`/personas/${ documento }/documento`, { params: params });
	}

	getEstudiantePorNumeroDocumento(documento: string): Observable<IEstudiante> {
		return this.http.get<IEstudiante>(`/estudiantes/documento/${ documento }`);
	}

	isMatriculado(documento: string): Observable<boolean> {
		return this.http.get<boolean>(`/matriculas/${ documento }/estudiante-matriculado`);
	}

	getPersonaAcudiente(documento: string): Observable<IPersona> {
		return this.http.get<IPersona>(`/personas/${ documento }/acudiente`);
	}

	createPersona(persona: IPersona): Observable<[boolean, IPersona]> {
		return this.http.post<[boolean, IPersona]>(`/personas`, persona);
	}

	updatePersona(idPersona: number, persona: IPersona): Observable<any> {
		return this.http.put<any>(`/personas/${ idPersona }`, persona);
	}

	destroyPersona(idPersona: number): Observable<any> {
		return this.http.delete<any>(`/personas/${ idPersona }`);
	}

}
