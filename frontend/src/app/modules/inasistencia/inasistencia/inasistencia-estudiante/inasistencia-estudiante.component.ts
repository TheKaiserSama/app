import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';

import { ApiCursoService } from '@api/api-curso.service';
import { ApiMatriculaService } from '@api/api-matricula.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { InasistenciaEstudianteService } from '@services/inasistencia-estudiante/inasistencia-estudiante.service';
import { ICurso, IEstudiante, IGradoMateria, IInasistencia, IMatricula } from '@interfaces/all.interface';

@Component({
	selector: 'app-inasistencia-estudiante',
	templateUrl: './inasistencia-estudiante.component.html',
	styleUrls: ['./inasistencia-estudiante.component.scss']
})
export class InasistenciaEstudianteComponent implements OnInit, OnDestroy {

	cursos$: Observable<ICurso[]>;
	materias$: Observable<IGradoMateria[]>;
	collectionSize$: Observable<number> = this.inasistenciaEstudianteService.collectionSize$;
	offset$: Observable<number> = this.inasistenciaEstudianteService.offset$;
	inasistencias$: Observable<IInasistencia[]> = this.inasistenciaEstudianteService.inasistencias$;
	ctrCurso: FormControl = new FormControl(null);
	ctrMateria: FormControl = new FormControl(null);
	estudiante: IEstudiante = this.authService.currentUserValue.estudiante;

	constructor(
		private apiCursoService: ApiCursoService,
		private apiMatriculaService: ApiMatriculaService,
		private authService: AuthenticationService,
		public inasistenciaEstudianteService: InasistenciaEstudianteService,
	) { }

	ngOnInit(): void {
		this.inasistenciaEstudianteService.getInasistenciasEstudiante();

		this.cursos$ = this.apiMatriculaService.getMatriculasByIdEstudiante(this.estudiante.id)
		.pipe(
			map((matriculas: IMatricula[]) => matriculas.map((matricula: IMatricula) => matricula.curso))
		);
	}

	ngOnDestroy(): void {
		this.inasistenciaEstudianteService.initStateInasistenciasEstudiante();
	}

	onChange(value: string): void {
		this.inasistenciaEstudianteService.pageSize = +value;
		this.inasistenciaEstudianteService.updateTablaInasistenciasEstudiante();
	}
	
	onPageChange(page: number): void {
		this.inasistenciaEstudianteService.page = page;
		this.inasistenciaEstudianteService.updateTablaInasistenciasEstudiante();
	}

	validateOffset(): number {
		return this.inasistenciaEstudianteService.validateOffset();
	}

	handleCurso(curso: ICurso): void {
		this.ctrMateria.setValue(null, { emitViewToModelChange: false });
		this.inasistenciaEstudianteService.objParams.id_materia = null;
		if (curso && curso.id) {
			const { id, id_sede, id_anio_lectivo, id_grado } = curso;
			this.inasistenciaEstudianteService.objParams.id_sede = id_sede;
			this.inasistenciaEstudianteService.objParams.id_anio_lectivo = id_anio_lectivo;
			this.inasistenciaEstudianteService.objParams.id_curso = id;
			this.materias$ = this.apiCursoService.getGradosMateriasParams(id_anio_lectivo, id_grado);
		} else {
			this.inasistenciaEstudianteService.objParams.id_sede = null;
			this.inasistenciaEstudianteService.objParams.id_anio_lectivo = null;
			this.inasistenciaEstudianteService.objParams.id_curso = null;
			this.materias$ = of([]);
		}
		this.inasistenciaEstudianteService.updateTablaInasistenciasEstudiante();
	}

	handleMateria(gradoMateria: IGradoMateria): void {
		if (gradoMateria && gradoMateria.materia)
			this.inasistenciaEstudianteService.objParams.id_materia = gradoMateria.materia.id;
		else
			this.inasistenciaEstudianteService.objParams.id_materia = null;
		this.inasistenciaEstudianteService.updateTablaInasistenciasEstudiante();
	}

}
