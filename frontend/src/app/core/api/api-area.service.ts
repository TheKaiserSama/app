import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import { IArea, IAlmacenArea } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiAreaService {

	constructor(private http: HttpClient) { }

	getAreaByPk(id: number): Observable<IArea> {
		return this.http.get<IArea>(`/areas/${ id }`);
	}

	getAreas(): Observable<IArea[]> {
		return this.http.get<IArea[]>(`/areas`);
	}

	getAreasPaginacion(limit: number, offset: number, searchTerm: string): Observable<IAlmacenArea> {
		let params = new HttpParams();
		params = params.set('limit', limit.toString());
		params = params.set('offset', offset.toString());
		params = params.set('search_term', searchTerm);
		return this.http.get<IAlmacenArea>('/areas/paginate', { params: params });
	}

	createArea(area: IArea): Observable<boolean> {
		return this.http.post<boolean>('/areas', area);
	}

	updateArea(id: number, area: IArea): Observable<any> {
		return this.http.put<any>(`/areas/${ id }`, area);
	}
	
	destroyArea(id: number): Observable<any> {
		return this.http.delete<any>(`/areas/${ id }`);
	}
	
}
