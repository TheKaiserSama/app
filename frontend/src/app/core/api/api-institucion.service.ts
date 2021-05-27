import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IInstitucion, ISede } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiInstitucionService {

	constructor(private http: HttpClient) { }

	getInstitucionByPk(id: number): Observable<IInstitucion> {
		return this.http.get<IInstitucion>(`/institucion/${ id }`);
	}

	getInstituciones(): Observable<IInstitucion[]> {
		return this.http.get<IInstitucion[]>(`/institucion`);
	}

	createInstitucion(institucion: IInstitucion): Observable<boolean> {
		return this.http.post<boolean>(`/institucion`, institucion);
	}

	updateInstitucion(id: number, institucion: IInstitucion): Observable<any> {
		return this.http.put<any>(`/institucion/${ id }`, institucion);
	}

	getSedeByPk(id: number): Observable<ISede> {
		return this.http.get<ISede>(`/sedes/${ id }`);
	}

	getSedes(): Observable<ISede[]> {
		return this.http.get<ISede[]>(`/sedes`);
	}

	getCountSedes(): Observable<number> {
		return this.http.get<number>(`/sedes/count`);
	}

	createSede(sede: ISede): Observable<boolean> {
		return this.http.post<boolean>(`/sedes`, sede);
	}

	updateSede(id: number, sede: ISede): Observable<any> {
		return this.http.put<any>(`/sedes/${ id }`, sede);
	}
	
	destroySede(id: number): Observable<any> {
		return this.http.delete<any>(`/sedes/${ id }`);
	}

}
