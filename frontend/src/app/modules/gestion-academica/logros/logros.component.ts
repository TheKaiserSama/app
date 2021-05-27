import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { ApiDocenteService } from '@api/api-docente.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { LogroService } from '@services/logro/logro.service';
import { PlanDocenteService } from '@services/plan-docente/plan-docente.service';
import { IDocente } from '@interfaces/all.interface';

@Component({
	selector: 'app-logros',
	templateUrl: './logros.component.html',
	styleUrls: ['./logros.component.scss']
})
export class LogrosComponent implements OnInit {

	constructor(
        private apiDocenteService: ApiDocenteService,
		private authService: AuthenticationService,
        private planDocenteService: PlanDocenteService,
        private logroService: LogroService
	) { }

	ngOnInit(): void {
        this.logroService.initListLogros = false;
        const token = this.authService.getItemLocalStorage('token');
        const decodedToken = this.authService.decodeToken(token);

        this.apiDocenteService.getDocenteByPkPersona(decodedToken['persona']['id'])
        .pipe(take(1))
        .subscribe((docente: IDocente) => {
            this.planDocenteService.idDocente = docente.id;
            this.planDocenteService.getStorePlanDocentes();
        });
	}

}