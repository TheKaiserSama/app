import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { concatMap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { NotaEstudianteService } from '@services/nota-estudiante/nota-estudiante.service';
import { IAnioLectivo, IMatricula, IPeriodo } from '@interfaces/all.interface';
import { compareFn, getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-notas-estudiante',
	templateUrl: './notas-estudiante.component.html',
	styleUrls: ['./notas-estudiante.component.scss']
})
export class NotasEstudianteComponent implements OnInit {

	matriculasPorEstudiante$: Observable<IMatricula[]>; // Cursos del estudiante
	notasPorMateria$: Observable<any>;
	logrosPorPeriodo = [];
	ctrCurso: FormControl = new FormControl({ value: null, disabled: true });
	encabezadosTabla: string[] = [];
	compareFn = compareFn;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiPeriodoService: ApiPeriodoService,
		private notaEstudianteService: NotaEstudianteService,
	) { }

	ngOnInit(): void {
		this.matriculasPorEstudiante$ = this.notaEstudianteService.getMatriculasPorEstudiante()
		.pipe(
			map((matriculas: IMatricula[]) => {
				this.ctrCurso.enable();
				const index = matriculas.findIndex((matricula: IMatricula) =>
				matricula.anio_lectivo.anio_actual == getCurrentYear());
				if (index > -1) {
					this.ctrCurso.setValue(matriculas[index]);
					this.getEncabezados(matriculas[index].id_anio_lectivo);
					this.getNotasDefinitivasPorMateria(matriculas[index]);
				}
				return matriculas;
			})
		);
	}

	getEncabezados(idAnioLectivo: number): void {
		this.apiAnioLectivoService.getAnioLectivoByPk(idAnioLectivo)
		.pipe(
			concatMap((anioLectivo: IAnioLectivo) =>
			this.apiPeriodoService.getPeriodosPorAnioLectivo(anioLectivo.id)),
			map((periodos: IPeriodo[]) =>
				periodos.map(({ numero }: IPeriodo) => `Periodo ${ numero }`)
			),
			take(1)
		).subscribe((encabezados: string[]) => {
			// encabezados.unshift('Materia', 'N° Logro');
			this.encabezadosTabla = encabezados;
		});
	}

	handleCurso(matricula: IMatricula): void {
		if (!matricula) return;
		this.notaEstudianteService.objParams.idEstudiante = matricula.id_estudiante;
		this.getNotasDefinitivasPorMateria(matricula);
	}

	getNotasDefinitivasPorMateria(matricula: IMatricula): void {
		const { id_curso, id_anio_lectivo, curso: { grado: { id } } } = matricula;
		this.notasPorMateria$ = this.notaEstudianteService.getNotaDefinitivaPorMateria(id_curso, { id_anio_lectivo, id_grado: id })
		.pipe(
			map((notasDefinitivas: any) => {
				this.arrayLogros(notasDefinitivas);
				return notasDefinitivas;
			})
		);
	}

	arrayLogros(notasDefinitivas: any): void {
		notasDefinitivas.map((notasPorMateria: any) => {
			this.logrosPorPeriodo.push(this.maxLogros(notasPorMateria));
		});
	}

	maxLogros(notasPorMateria: any): any {
		const notasPorMateriaCopia = { ...notasPorMateria };
		delete notasPorMateriaCopia.materia;
		delete notasPorMateriaCopia.longitud;

		const logrosPorPeriodo = [];
		for (const property in notasPorMateriaCopia)
			logrosPorPeriodo.push(notasPorMateriaCopia[property]);

		if (logrosPorPeriodo.length == 0)
			for (let i = 0; i < this.encabezadosTabla.length - 2; i++)
				logrosPorPeriodo.push([]);
		
		const longitudLogros = logrosPorPeriodo.map((logro) => logro.length);
		const maxIndex = longitudLogros.indexOf(Math.max(...longitudLogros));
		return logrosPorPeriodo[maxIndex];
	}

}