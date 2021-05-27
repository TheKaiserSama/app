import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { IUsuario } from '@interfaces/all.interface';
import { ROL } from '@shared/const';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService {

	private _currentUser$: BehaviorSubject<IUsuario>;
	private helper = new JwtHelperService();
	private decodedToken: IUsuario;
	private token: string;
	currentUser$: Observable<IUsuario>;

	constructor(
		private http: HttpClient,
		private router: Router
	) {
		this.token = this.getItemLocalStorage('token');
		this.decodedToken = this.decodeToken(this.token);
		this._currentUser$ = new BehaviorSubject<IUsuario>(this.decodedToken);
		this.currentUser$ = this._currentUser$.asObservable();
	}

	getItemLocalStorage(name: string): any {
		return JSON.parse(localStorage.getItem(name));
	}

	decodeToken(token: string): any {
		return this.helper.decodeToken(token);
	}
	
	login(usuario: IUsuario): Observable<IUsuario> {
		return this.http.post<IUsuario>(`/login`, usuario).pipe(
			map((usuario: IUsuario) => {
				console.log(usuario);
				this.setSession(usuario);
				this.decodedToken = this.decodeToken(usuario.token);
				this._currentUser$.next(this.decodedToken);
				return usuario;
			})
		);
	}
	
	logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('expires_at');
		this._currentUser$.next(null);
		this.router.navigate(['/login']);
	}  

	isLoggedIn(): boolean {
        return moment().isBefore(this.getExpiration());
	}
	
	isLoggedOut(): boolean {
        return !this.isLoggedIn();
	}

	isAdmin(): boolean {
		const token = this.getItemLocalStorage('token');
		const decodedToken = this.decodeToken(token);
		return decodedToken['id_rol'] == ROL.ADMINISTRADOR.id;
    }
    
    isDocente(): boolean {
        const token = this.getItemLocalStorage('token');
		const decodedToken = this.decodeToken(token);
		return decodedToken['id_rol'] == ROL.DOCENTE.id;
    }

	isEstudiante(): boolean {
        const token = this.getItemLocalStorage('token');
		const decodedToken = this.decodeToken(token);
		return decodedToken['id_rol'] == ROL.ESTUDIANTE.id;
	}

	isDirectorGrupo(): boolean {
		const token = this.getItemLocalStorage('token');
		const decodedToken = this.decodeToken(token);
		const { docente } = decodedToken;
		if (docente && docente.director_grupo && docente.director_grupo.length > 0)
			return true;
		else
			return false;
	}
	
	get currentUserValue() {
		return this._currentUser$.value;
	}

	private setSession(usuario: IUsuario): void {
		const expiresAt = moment().add(usuario.expiresIn, 'seconds');
        localStorage.setItem('token', JSON.stringify(usuario.token));
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
	}

	private getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
	}
	
}