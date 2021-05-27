import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiDocenteService } from '@api/api-docente.service';
import { ApiEstudianteService } from '@api/api-estudiante.service';
import { ApiInstitucionService } from '@api/api-institucion.service';

@Component({
	selector: 'app-welcome-admin',
	templateUrl: './welcome-admin.component.html',
	styleUrls: ['./welcome-admin.component.scss']
})
export class WelcomeAdminComponent implements OnInit {

	countDocentes$: Observable<number>;
	countEstudiantes$: Observable<number>;
	countSedes$: Observable<number>;
	stylesSedes = {
		titulo: 'SEDES',
		icono: 'fa fa-university',
		color: '#00A65A'
	};

	stylesDocentes = {
		titulo: 'DOCENTES',
		icono: 'fa fa-users',
		color: '#DD4B39'
	};

	stylesEstudiantes = {
		titulo: 'ESTUDIANTES',
		icono: 'fa fa-users',
		color: '#F39C12'
	};

	constructor(
		private apiDocenteService: ApiDocenteService,
		private apiEstudianteService: ApiEstudianteService,
		private apiInstitucionService: ApiInstitucionService
	) { }

	ngOnInit(): void {
		this.countDocentes$ = this.apiDocenteService.getCountDocentes();
		this.countEstudiantes$ = this.apiEstudianteService.getCountEstudiantes();
		this.countSedes$ = this.apiInstitucionService.getCountSedes();
	}

}
