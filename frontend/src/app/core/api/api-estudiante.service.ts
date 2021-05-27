import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';

import { IEstudiante } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiEstudianteService {

	constructor(private http: HttpClient) { }

	getEstudianteByPkPersona(idPersona: number): Observable<IEstudiante> {
		return this.http.get<IEstudiante>(`/estudiantes/persona/${ idPersona }`);
	}

	getCountEstudiantes(): Observable<number> {
		return this.http.get<number>(`/estudiantes/count`);
	}

}
