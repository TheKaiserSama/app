import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, of } from 'rxjs';
import { concatMap, takeUntil, map } from 'rxjs/operators';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiInstitucionService } from '@api/api-institucion.service';
import { ApiOtrosService } from '@api/api-otros.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { MatriculaService } from '@services/matricula/matricula.service';
import { ngbDateToString, stringToNgbDateStruct, compareFn, getCurrentYear, getCurrentDate } from '@shared/helpers/transform';
import {
	IAnioLectivo, IGrado, IMatricula, ICurso,
	IEstudiante, IEstadoMatricula, IEstadoEstudiante, ISede, IGrupo 
} from '@interfaces/all.interface';

@Component({
	selector: 'app-info-matricula',
	templateUrl: './info-matricula.component.html',
	styleUrls: ['./info-matricula.component.scss']
})
export class InfoMatriculaComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	@Input() button: any;
	@Output() emitMatricula = new EventEmitter<IMatricula>();
	formMatricula: FormGroup;
	sedes$: Observable<ISede[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	grupos$: Observable<ICurso[]>;
	estadosMatricula$: Observable<IEstadoMatricula[]>;
	estadosEstudiante$: Observable<IEstadoEstudiante[]>;
	params: any = {};
	compareFn = compareFn;
	getCurrentYear = getCurrentYear;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		private apiInstitucionService: ApiInstitucionService,
		private apiOtrosService: ApiOtrosService,
        private formInitService: FormInitService,
		public matriculaService: MatriculaService,
	) { }

	ngOnInit(): void {
		this.formMatricula = this.formInitService.getFormMatricula();
		this.sedes$ = this.apiInstitucionService.getSedes();
		this.estadosMatricula$ = this.apiOtrosService.getEstadosMatricula();
		this.estadosEstudiante$ = this.apiOtrosService.getEstadosEstudiante();
		this.initStateForm();

		this.matriculaService.matricula$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((matricula: any) => {
			if (!matricula) return;
			this.setMatricula(matricula);
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	initStateForm(): void {
		this.aniosLectivos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear()).pipe(
			map((anioLectivo: IAnioLectivo) => {
				if (!anioLectivo) return [];
				this.anio_lectivo.setValue(anioLectivo);
				return [anioLectivo];
			})
		);
		this.fecha_registro.setValue(getCurrentDate());
	}

	getMatricula(): IMatricula {
		const _fecha_registro: NgbDate = this.fecha_registro.value;
		const _fecha_ingreso: NgbDate = this.fecha_ingreso.value;
		const fecha_registro = ngbDateToString(_fecha_registro);
		const fecha_ingreso = ngbDateToString(_fecha_ingreso);
		
		const curso: ICurso = {
			...this.grupo.value,
			sede: this.sede.value
		};

		const estudiante: IEstudiante = {
			fecha_registro: fecha_registro,
			fecha_ingreso: fecha_ingreso,
			estado_estudiante: this.estado_estudiante.value,
			id_estado_estudiante: this.estado_estudiante.value.id
		};

		return {
			fecha_registro: fecha_registro,
			id_anio_lectivo: this.grupo.value['anio_lectivo'].id,
			anio_lectivo: this.grupo.value['anio_lectivo'],
			estado_matricula: this.estado_matricula.value,
			id_estado_matricula: this.estado_matricula.value.id,
			curso: curso,
			estudiante: estudiante
		};
	}

	setMatricula(matricula: IMatricula): void {
		const { estudiante, estado_matricula, anio_lectivo, curso } = matricula;
		const { fecha_ingreso, fecha_registro, estado_estudiante } = estudiante;
		const { grado, sede } = curso;
		const _fecha_registro = stringToNgbDateStruct(fecha_registro);
		const _fecha_ingreso = stringToNgbDateStruct(fecha_ingreso);

		this.aniosLectivos$ = of([anio_lectivo]);
		this.anio_lectivo.setValue(anio_lectivo);

		this.fecha_registro.setValue(_fecha_registro);
		this.fecha_ingreso.setValue(_fecha_ingreso);
		this.sede.setValue(sede, { emitViewToModelChange: false });
		this.params.id_sede = sede.id;
		this.params.id_anio_lectivo = anio_lectivo.id;
		this.params.id_grado = grado.id;

		this.grados$ = this.apiCursoService.getCursosPorSede(this.params)
		.pipe(map((grados: IGrado[]) => {
			if (grados.length > 0) this.grado.setValue(grado, { emitViewToModelChange: false });
			return grados;
		}));
		this.grupos$ = this.apiCursoService.getGruposPorGrado(this.params)
		.pipe(map((grupos: IGrupo[]) => {
			if (grupos.length > 0) this.grupo.setValue(curso);
			return grupos;
		}));
		this.estado_matricula.setValue(estado_matricula);
		this.estado_estudiante.setValue(estado_estudiante);
	}

	handleSede(sede: ISede): void {
		if (!sede) return;
		this.grado.setValue(null);
		this.grupo.setValue(null);
		this.grupos$ = of([]);

		this.grados$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear())
		.pipe(
			concatMap((anioLectivo: IAnioLectivo) => {
				if (anioLectivo) {
					this.params.id_sede = sede.id;
					this.params.id_anio_lectivo = anioLectivo.id;
					return this.apiCursoService.getCursosPorSede(this.params);
				}
				return of([]);
			})
		);
	}

	handleGrado(grado: IGrado): void {
		if (!grado) return;
		this.grupo.setValue(null);
		this.params.id_grado = grado.id;
		const { id_sede, id_anio_lectivo, id_grado } = this.params;
		this.grupos$ = this.apiCursoService.getGruposPorGrado({ id_sede, id_anio_lectivo, id_grado });
	}

	onDateSelect(date: NgbDate): void { }

	sendFormMatricula(): void {
		if (this.formMatricula.invalid) return;
		this.emitMatricula.emit(this.getMatricula());
	}

	resetFormMatricula(): void {
		this.formMatricula.reset();
		this.initStateForm();
	}

	previousTab(): void {
		const matricula = this.getMatricula();
		this.matriculaService.setMatricula(matricula);
		this.matriculaService.setTabActive(2);
	}

	get fecha_registro() { return this.formMatricula.get('fecha_registro'); }
	get fecha_ingreso() { return this.formMatricula.get('fecha_ingreso'); }
	get grado() { return this.formMatricula.get('grado'); }
	get grupo() { return this.formMatricula.get('grupo'); }
	get sede() { return this.formMatricula.get('sede'); }
	get estado_matricula() { return this.formMatricula.get('estado_matricula'); }
	get estado_estudiante() { return this.formMatricula.get('estado_estudiante'); }
	get anio_lectivo() { return this.formMatricula.get('anio_lectivo'); }

}