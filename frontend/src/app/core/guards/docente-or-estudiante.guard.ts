import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '@core/authentication/authentication.service';

@Injectable({
	providedIn: 'root'
})
export class DocenteOrEstudianteGuard implements CanActivate {

	constructor(
		private authService: AuthenticationService,
		private router: Router,
	) { }

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (this.authService.isLoggedIn() && (this.authService.isDocente() || this.authService.isEstudiante())) {
			return true;
		}
		this.router.navigate(['/dashboard']);
		return false;
	}
	
}