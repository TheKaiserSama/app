import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IAnioLectivo, IBoletin, IDirectorGrupo, IPeriodo, IPrintBoletin } from '@interfaces/all.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiBoletinService } from '@api/api-boletin.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { BoletinPDFService } from '@services/boletin-PDF/boletin-pdf.service';
import { getCurrentYear } from '@shared/helpers/transform';

interface ICheckBoxEstudiante {
	id?: number;
	value?: string;
	checked?: boolean;
}

@Component({
	selector: 'app-vista-boletines-administrador',
	templateUrl: './vista-boletines-administrador.component.html',
	styleUrls: ['./vista-boletines-administrador.component.scss']
})
export class VistaBoletinesAdministradorComponent implements OnInit {

	@Input() directorGrupo: IDirectorGrupo;
	boletines: IBoletin[] = [];
	periodos$: Observable<IPeriodo[]>;
	boletinesPorPeriodo$: Observable<IBoletin[]> = of([]);
	checkboxEstudiantes: ICheckBoxEstudiante[] = [];
	ctrPeriodo: FormControl = new FormControl(null);
	currentYear: number = getCurrentYear();

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiBoletinService: ApiBoletinService,
		private apiPeriodoService: ApiPeriodoService,
		private boletinPDFService: BoletinPDFService,
		public activeModal: NgbActiveModal
	) {}

	ngOnInit(): void {
		this.getInitData();
	}

	handlePeriodo(periodo: IPeriodo): void {
		const { curso } = this.directorGrupo;
		if (periodo && periodo.id && curso && curso.id) {
			const params: IBoletin = {
				id_anio_lectivo: periodo.id_anio_lectivo,
				id_curso: curso.id,
				id_director_grupo: this.directorGrupo.id,
				id_periodo: periodo.id,
			};
			this.apiBoletinService.getBoletinesPorPeriodo(params)
			.pipe(take(1))
			.subscribe((boletines: IBoletin[]) => {
				this.boletines = boletines;
				this.checkboxEstudiantes = boletines.map(({ estudiante }: IBoletin) => ({
					id: estudiante.id,
					value: `value_${ estudiante.id }`,
					checked: false
				}));
			});;
		} else {
			const params: IBoletin = {
				id_anio_lectivo: curso.id_anio_lectivo,
				id_curso: curso.id,
				id_director_grupo: this.directorGrupo.id,
			};
			this.apiBoletinService.getBoletinesPorPeriodo(params)
			.pipe(take(1))
			.subscribe((boletines: IBoletin[]) => {
				this.boletines = boletines;
				this.checkboxEstudiantes = boletines.map(({ estudiante }: IBoletin) => ({
					id: estudiante.id,
					value: `value_${ estudiante.id }`,
					checked: false
				}));
			});;
		}
	}

	printBoletines(): void {
		this.apiBoletinService.printBoletines(this.getQueryParams())
		.pipe(take(1))
		.subscribe((boletines: IPrintBoletin[]) => this.boletinPDFService.printBoletines(boletines));
	}

	downloadBoletines(): void {
		this.apiBoletinService.printBoletines(this.getQueryParams())
		.pipe(take(1))
		.subscribe((boletines: IPrintBoletin[]) => this.boletinPDFService.downloadBoletines(boletines));
	}

	getCheckBoxEstudiante(id: number): ICheckBoxEstudiante {
		const index = this.checkboxEstudiantes
		.findIndex((checkBoxEstudiante: ICheckBoxEstudiante) => checkBoxEstudiante.id === id);
		return this.checkboxEstudiantes[index];
	}

	checkboxSelected(): boolean {
		const index: number = this.checkboxEstudiantes.findIndex((checkboxEstudiante: ICheckBoxEstudiante) => checkboxEstudiante.checked);
		return (index > -1) ? true : false;
	}

	private getQueryParams(): any {
		const idEstudiantes: number[] = this.checkboxEstudiantes
		.filter((checkboxEstudiante: ICheckBoxEstudiante) => checkboxEstudiante.checked)
		.map((checkboxEstudiante: ICheckBoxEstudiante) => checkboxEstudiante.id);
		const id: number[][] = idEstudiantes.map((id: number) => {
			const boletin: IBoletin = this.getBoletin(id);
			if (boletin)
				return [id, boletin.id];
		});
		const periodo = this.ctrPeriodo.value;
		const { curso, docente } = this.directorGrupo;
		const query: any = { id, id_curso: curso.id, id_grado: curso.id_grado, id_docente: docente.id };
		if (periodo && periodo.id) query.id_periodo = periodo.id;
		return query;
	}

	private getBoletin(idEstudiante: number): IBoletin {
		const index: number = this.findBoletin(idEstudiante);
		return (index > -1) ? this.boletines[index] : null;
	}

	private findBoletin(idEstudiante: number): number {
		return this.boletines.findIndex((boletin: IBoletin) => boletin.id_estudiante === idEstudiante);
	}

	private getInitData(): void {
		this.periodos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(this.currentYear)
		.pipe(
			concatMap((anioLectivo: IAnioLectivo) => 
			this.apiPeriodoService.getPeriodosPorAnioLectivo(anioLectivo.id))
		);
	}

}
