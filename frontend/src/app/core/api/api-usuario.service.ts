import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUsuario } from '@interfaces/all.interface';

@Injectable({
	providedIn: 'root'
})
export class ApiUsuarioService {

	constructor(private http: HttpClient) { }

	createUsuario(usuario: IUsuario): Observable<boolean> {
		return this.http.post<boolean>(`/usuarios`, usuario);
	}

	updateUsuario(id: number, usuario: IUsuario): Observable<any> {
		return this.http.put<any>(`/usuarios/${ id }`, usuario);
	}

	destroyUsuario(id: number): Observable<number> {
		return this.http.delete<number>(`/usuarios/${ id }`);
	}

}
