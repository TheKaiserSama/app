import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import { IAlmacenMateria, IMateria } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiMateriaService {

	constructor(private http: HttpClient) { }
	
	getMateriasByPkArea(id: number): Observable<IMateria[]> {
		return this.http.get<IMateria[]>(`/areas/${ id }/materias`);
	}
	
	getMaterias(limit: number, offset: number, searchTerm: string): Observable<IAlmacenMateria> {
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', searchTerm);
		return this.http.get<IAlmacenMateria>('/materias', { params: params });
	}

	createMateria(materia: IMateria): Observable<boolean> {
		return this.http.post<boolean>('/materias', materia);
	}

	updateMateria(idMateria: number, materia: IMateria): Observable<any> {
		return this.http.put<any>(`/materias/${ idMateria }`, materia);
	}
	
	destroyMateria(idMateria: number): Observable<any> {
		return this.http.delete<any>(`/materias/${ idMateria }`);
	}

}
