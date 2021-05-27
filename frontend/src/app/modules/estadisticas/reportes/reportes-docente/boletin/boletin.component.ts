import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertResult } from 'sweetalert2';

import { FormatoBoletinComponent } from '@modules/estadisticas/formato-boletin/formato-boletin.component';
import { ImprimirBoletinesComponent } from '@modules/estadisticas/imprimir-boletines/imprimir-boletines.component';
import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiBoletinService } from '@api/api-boletin.service';
import { ApiDirectorGrupoService } from '@api/api-director-grupo.service';
import { ApiMatriculaService } from '@api/api-matricula.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { BoletinService } from '@services/boletin/boletin.service';
import { BoletinPDFService } from '@services/boletin-PDF/boletin-pdf.service';
import { IAnioLectivo, IBoletin, ICurso, IDocente, IMatricula, IPeriodo, IPrintBoletin } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-boletin',
	templateUrl: './boletin.component.html',
	styleUrls: ['./boletin.component.scss']
})
export class BoletinComponent implements OnInit {

	matriculas$: Observable<IMatricula[]>;
	boletines: IBoletin[] = [];
	cursos$: Observable<ICurso[]>;
	periodos$: Observable<IPeriodo[]>;
	ctrCurso: FormControl = new FormControl(null);
	ctrPeriodo: FormControl = new FormControl({ value: null, disabled: true });
	currentYear: number = getCurrentYear();
	
	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiBoletinService: ApiBoletinService,
		private apiDirectorGrupoService: ApiDirectorGrupoService,
		private apiMatriculaService: ApiMatriculaService,
		private apiPeriodoService: ApiPeriodoService,
		private authService: AuthenticationService,
		private boletinService: BoletinService,
		private boletinPDFService: BoletinPDFService,
		private modalService: NgbModal,
	) { }
	
	ngOnInit(): void {
		this.getInitialData();
	}

	handleCurso(curso: ICurso): void {
		if (curso && curso.id) {
			this.ctrPeriodo.enable();
			this.matriculas$ = this.apiMatriculaService.getMatriculaByIdCurso(curso.id);
		}	
	}

	handlePeriodo(periodo: IPeriodo): void {
		const curso = this.ctrCurso.value;
		if (periodo && periodo.id && curso && curso.id) {
			const params: IBoletin = {
				id_anio_lectivo: periodo.id_anio_lectivo,
				id_curso: curso.id,
				id_director_grupo: this.getDocente().director_grupo[0].id, // Cambiar cuando se ajuste la consulta
				id_periodo: periodo.id,
			};
			this.boletinService.getBoletinesPorPeriodo(params);
		} else {
			const params: IBoletin = {
				id_anio_lectivo: curso.id_anio_lectivo,
				id_curso: curso.id,
				id_director_grupo: this.getDocente().director_grupo[0].id, // Cambiar cuando se ajuste la consulta
			};
			this.boletinService.getBoletinesPorPeriodo(params);
		}
	}

	showCreateButton(idEstudiante: number): boolean {
		if (this.ctrPeriodo.value)
			return this.boletines.findIndex((boletin: IBoletin) => boletin.id_estudiante == idEstudiante) > -1 ? true : false;
		else
			return true;
	}

	showUpdateDeletePrintButton(idEstudiante: number): boolean {
		if (this.ctrPeriodo.value)
			return this.boletines.findIndex((boletin: IBoletin) => boletin.id_estudiante == idEstudiante) > -1 ? false : true;
		else
			return true;
	}

	createBoletin(matricula: IMatricula): void {
		const modalRef = this.modalService.open(FormatoBoletinComponent, this.getModalOptions());
		const componentProperties = {
			boletin: { observaciones: '' },
			matricula,
			periodo: this.ctrPeriodo.value,
			shouldCreate: true
		};
		this.setComponentProperties(modalRef, componentProperties);
	}

	updateBoletin(matricula: IMatricula): void {
		const boletin: IBoletin = this.getBoletin(matricula.id_estudiante);
		const modalRef = this.modalService.open(FormatoBoletinComponent, this.getModalOptions());
		const componentProperties = {
			boletin,
			matricula,
			periodo: this.ctrPeriodo.value,
			shouldCreate: false
		};
		this.setComponentProperties(modalRef, componentProperties);
	}

	deleteBoletin(matricula: IMatricula): void {
		const boletin: IBoletin = this.getBoletin(matricula.id_estudiante);
		PopUp.question('Eliminar boletín', 'Esta operación no se puede deshacer.')
		.then((results: SweetAlertResult) => {
			if (results.value) {
				this.boletinService.destroyBoletin(boletin.id)
				.pipe(take(1))
				.subscribe(({ affectedRowsCount }) => {
					if (affectedRowsCount > 0) {
						const { id_anio_lectivo, id_curso, id_periodo } = boletin;
						const params: IBoletin = {
							id_anio_lectivo,
							id_curso,
							id_director_grupo: this.getDocente().director_grupo[0].id, // Cambiar cuando se ajuste la consulta
							id_periodo,
						};
						this.boletinService.getBoletinesPorPeriodo(params);
						PopUp.success('Operación exitosa', 'Boletín eliminado.');
					}
				});
			}
		});
	}

	printBoletin(matricula: IMatricula): void {
		const { curso, id_curso, id_estudiante } = matricula;
		const { id_grado } = curso;
		const boletin: IBoletin = this.getBoletin(id_estudiante);
		const { docente } = this.authService.currentUserValue;
		const params: any = { id_boletin: boletin.id, id_curso, id_docente: docente.id, id_grado };

		if (this.ctrPeriodo.value && this.ctrPeriodo.value.id)
			params.id_periodo = this.ctrPeriodo.value.id;
		this.apiBoletinService.printOneBoletin(id_estudiante, params)
		.subscribe((boletinEstudiante: IPrintBoletin) => this.boletinPDFService.printBoletin(boletinEstudiante));
	}

	downloadBoletin(matricula: IMatricula): void {
		const { curso, id_curso, id_estudiante } = matricula;
		const { id_grado } = curso;
		const boletin: IBoletin = this.getBoletin(id_estudiante);
		const { docente } = this.authService.currentUserValue;
		const params: any = { id_boletin: boletin.id, id_curso, id_docente: docente.id, id_grado };

		if (this.ctrPeriodo.value && this.ctrPeriodo.value.id)
			params.id_periodo = this.ctrPeriodo.value.id;
		this.apiBoletinService.printOneBoletin(id_estudiante, params)
		.subscribe((boletinEstudiante: IPrintBoletin) => this.boletinPDFService.downloadBoletin(boletinEstudiante));
	}

	printOrDownloadBoletines(): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		const modalRef = this.modalService.open(ImprimirBoletinesComponent, modalOptions);
		const { docente } = this.authService.currentUserValue;
		const componentProperties = {
			boletines: this.boletines,
			curso: this.ctrCurso.value,
			docente,
			matriculas$: this.matriculas$,
			periodo: this.ctrPeriodo.value
		};
		this.setComponentProperties(modalRef, componentProperties);
	}

	private getInitialData(): void {
		this.cursos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(this.currentYear)
		.pipe(
			concatMap((anioLectivo: IAnioLectivo) => 
			this.apiDirectorGrupoService.getCursosAsignadosADirector(
				this.getDocente().id, { id_anio_lectivo: anioLectivo.id })
			),
			map((cursos: ICurso[]) => {
				const index = cursos.findIndex((curso: ICurso) => curso.anio_lectivo.anio_actual === this.currentYear);
				this.ctrCurso.setValue(cursos[index]);
				return cursos;
			})
		);
		this.periodos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(this.currentYear)
		.pipe(
			concatMap((anioLectivo: IAnioLectivo) => 
			this.apiPeriodoService.getPeriodosPorAnioLectivo(anioLectivo.id))
		);
		this.boletinService.boletinesPorPeriodo$
		.subscribe((boletines: IBoletin[]) => this.boletines = boletines);
	}

	private getBoletin(idEstudiante: number): IBoletin {
		const index = this.boletines.findIndex((boletin: IBoletin) => boletin.id_estudiante == idEstudiante);
		return (index > -1) ? this.boletines[index] : null;
	}

	private getDocente(): IDocente {
		return this.authService.currentUserValue.docente;
	}

	private getModalOptions(): NgbModalOptions {
		return {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			windowClass: 'modal-hoja-tamanio-oficio',
		};
	}

	private setComponentProperties(modalRef: NgbModalRef, componentProperties: any = {}): void {
		for (const property in componentProperties) {
			modalRef.componentInstance[property] = componentProperties[property];
		}
	}

}
