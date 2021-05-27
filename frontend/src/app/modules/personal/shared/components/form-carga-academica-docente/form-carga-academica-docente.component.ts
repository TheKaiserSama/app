import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiInstitucionService } from '@api/api-institucion.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { PlanDocenteService } from '@services/plan-docente/plan-docente.service';
import { IGrado, IAnioLectivo, IPlanDocente, ICurso, IGrupo, IPeriodo, ISede, IGradoMateria } from '@interfaces/all.interface';
import { compareFn, ngbDateToString, stringToNgbDateStruct, getCurrentYear, getCurrentDate } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-form-carga-academica-docente',
	templateUrl: './form-carga-academica-docente.component.html',
	styleUrls: ['./form-carga-academica-docente.component.scss']
})
export class FormCargaAcademicaDocenteComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	formCarAcadDocente: FormGroup;
	createPlanDocente: boolean;
	controls: any = {};
	planDocente: IPlanDocente;
	objParams: any = {};
	sedes$: Observable<ISede[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	grupos$: Observable<IGrupo[]>;
	materias$: Observable<IGradoMateria[]>;
	periodos$: Observable<IPeriodo[]>;
	compareFn = compareFn;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		private apiInstitucionService: ApiInstitucionService,
		private apiPeriodoService: ApiPeriodoService,
		private formInitService: FormInitService,
		public planDocenteService: PlanDocenteService,
	) { }

	ngOnInit(): void {
		this.formCarAcadDocente = this.formInitService.getFormCarAcadDocente();
		this.sedes$ = this.apiInstitucionService.getSedes();

		this.initControls();
		this.initFormCarAcadDocente();
		this.planDocenteService.planDocente$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((planDocente: IPlanDocente) => {
			if (!planDocente) return;
			this.planDocente = planDocente;
		});

		this.planDocenteService.shouldCreate$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((state: boolean) => {
			this.createPlanDocente = state;
			if (!state) {
				this.setCarAcadDocente(this.planDocente);
			}
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getCarAcadDocente(): IPlanDocente {
		const cargaAcademica: IPlanDocente = {};
		const _fecha_registro: NgbDate = this.controls['fecha_registro'].value;
		const fecha_registro: string = ngbDateToString(_fecha_registro);
		const curso: ICurso = { ...this.controls['grupo'].value };

		cargaAcademica.fecha_registro = fecha_registro;
		cargaAcademica.materia = this.controls['materia'].value;
		cargaAcademica.periodo = this.controls['periodo'].value;
		cargaAcademica.anio_lectivo = this.controls['anio_lectivo'].value;
		cargaAcademica.sede = this.controls['sede'].value;
		cargaAcademica.curso = curso;
		cargaAcademica.id_materia = this.controls['materia'].value.id;
		cargaAcademica.id_anio_lectivo = this.controls['anio_lectivo'].value.id;
		cargaAcademica.id_sede = this.controls['sede'].value.id;
		return cargaAcademica;
	}
	
	setCarAcadDocente(planDocente: IPlanDocente): void {
		const { fecha_registro } = planDocente;
		const _fecha_registro = stringToNgbDateStruct(fecha_registro);

		this.controls['fecha_registro'].setValue(_fecha_registro);
		this.controls['area'].setValue(planDocente.materia.area);
		this.controls['materia'].setValue(planDocente.materia);
		this.controls['anio_lectivo'].setValue(planDocente.anio_lectivo);
		this.controls['periodo'].setValue(planDocente.periodo);
		this.controls['grado'].setValue(planDocente.curso.grado);
		this.controls['grupo'].setValue(planDocente.curso.grupo);
		this.controls['sede'].setValue(planDocente.sede);
	}

	handleSede(sede: ISede): void {
		if (!sede) return;
		this.controls['grado'].setValue(null);
		this.controls['grupo'].setValue(null);
		this.grupos$ = of([]);

		const { anio_lectivo } = this.controls;
		if (anio_lectivo.value) {
			this.objParams.id_anio_lectivo = anio_lectivo.value.id;
			this.objParams.id_sede = sede.id;
			this.grados$ = this.apiCursoService.getCursosPorSede(this.objParams);
		}
	}

	handleGrado(grado: IGrado): void {
		if (!grado) return;
		this.controls['grupo'].setValue(null);
		this.objParams.id_grado = grado.id;
		this.grupos$ = this.apiCursoService.getGruposPorGrado(this.objParams);
		this.materias$ = this.apiCursoService.getGradosMateriasParams(
			this.controls['anio_lectivo'].value.id, grado.id
		);
	}

	onDateSelect($event: NgbDate): void { }

	sendFormCarAcadDocente(): void {
		if (this.formCarAcadDocente.invalid) return;

		if (this.createPlanDocente) {
			PopUp.question('Esta seguro/a?', 'Creara nueva(s) carga(s) academica(s).')
			.then((result: SweetAlertResult) => {
				if (result.value) {
					this.planDocenteService.setPlanDocente(this.getCarAcadDocente());
					this.planDocenteService.createPlanDocente()
					.pipe(takeUntil(this.unsubscribe))
					.subscribe((planDocente: IPlanDocente) => this.resetFormCarAcadDocente());
				}
			});
			return;
		}

		PopUp.question('Esta seguro/a?', 'Editara la carga academica actual.')
		.then((result: SweetAlertResult) => {
			if (result.value) {
				this.planDocenteService.setPlanDocente(this.getCarAcadDocente());
				this.planDocenteService.updatePlanDocente()
				.pipe(takeUntil(this.unsubscribe))
				.subscribe((planDocente: IPlanDocente) => this.resetFormCarAcadDocente());
			}
		});
	}

	resetFormCarAcadDocente(): void {
		this.formCarAcadDocente.reset();
		this.initFormCarAcadDocente();
	}
	
	private initFormCarAcadDocente(): void {
		this.aniosLectivos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(getCurrentYear()).pipe(
			map((anioLectivo: IAnioLectivo) => {
				if (!anioLectivo) return [];
				this.periodos$ = this.apiPeriodoService.getPeriodosPorAnioLectivo(anioLectivo.id);
				this.controls['anio_lectivo'].setValue(anioLectivo);
				return [anioLectivo];
			})
		);
		this.controls['fecha_registro'].setValue(getCurrentDate());
	}

	private initControls(): void {
		Object.keys(this.formCarAcadDocente.controls).forEach(key => {
            this.controls[key] = this.formCarAcadDocente.get(key);
		});
	}

}
