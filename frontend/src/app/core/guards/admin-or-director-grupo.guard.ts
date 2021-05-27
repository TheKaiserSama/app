import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@core/authentication/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AdminOrDirectorGrupoGuard implements CanActivate {

	constructor(
		private authService: AuthenticationService,
		private router: Router,
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		this.authService.isDirectorGrupo();
		if (this.authService.isLoggedIn() && (this.authService.isAdmin() || this.authService.isDirectorGrupo())) {
			return true;
		}
		this.router.navigate(['/dashboard']);
		return false;
	}
	
}