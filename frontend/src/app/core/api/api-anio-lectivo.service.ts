import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAnioLectivo, IEstadoAnioLectivo, IRango } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiAnioLectivoService {

	constructor(private http: HttpClient) { }

	getAnioLectivoByPk(id: number): Observable<IAnioLectivo> {
		return this.http.get<IAnioLectivo>(`/anios-lectivos/${ id }`);
	}

	getAniosLectivos(objParams?: any): Observable<IAnioLectivo[]> {
		let params = new HttpParams();
		const { vigente } = objParams;
		if (vigente) params = params.set('vigente', JSON.stringify(vigente));
		return this.http.get<IAnioLectivo[]>(`/anios-lectivos`, { params: params });
	}

	getAnioLectivoPorNumero(anio: number): Observable<IAnioLectivo> {
		return this.http.get<IAnioLectivo>(`/anios-lectivos/anio/${ anio }`);
	}

	createAnioLectivo(anioLectivo: IAnioLectivo): Observable<boolean> {
		return this.http.post<boolean>(`/anios-lectivos`, anioLectivo);
	}

	updateAnioLectivo(id: number, anioLectivo: IAnioLectivo): Observable<any> {
		return this.http.put<any>(`/anios-lectivos/${ id }`, anioLectivo);
	}

	destroyAnioLectivo(id: number): Observable<any> {
		return this.http.delete<any>(`/anios-lectivos/${ id }`);
	}

	getEstadoAnioLectivoByPk(id: number): Observable<IEstadoAnioLectivo> {
		return this.http.get<IEstadoAnioLectivo>(`/estados-anios-lectivos/${ id }`);
	}

	getEstadosAniosLectivos(): Observable<IEstadoAnioLectivo[]> {
		return this.http.get<IEstadoAnioLectivo[]>(`/estados-anios-lectivos`);
	}

	getRangoByPk(id: number): Observable<IRango> {
		return this.http.get<IRango>(`/rangos/${ id }`);
	}

	getRangos(): Observable<IRango[]> {
		return this.http.get<IRango[]>(`/rangos`);
	}

}
