import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiBoletinService } from '@api/api-boletin.service';
import { BoletinPDFService } from '@services/boletin-PDF/boletin-pdf.service';
import { IBoletin, ICurso, IDocente, IEstudiante, IMatricula, IPeriodo, IPrintBoletin } from '@interfaces/all.interface';

interface ICheckBoxEstudiante {
	id?: number;
	value?: string;
	checked?: boolean;
}

@Component({
	selector: 'app-imprimir-boletines',
	templateUrl: './imprimir-boletines.component.html',
	styleUrls: ['./imprimir-boletines.component.scss']
})
export class ImprimirBoletinesComponent implements OnInit {

	@Input() boletines: IBoletin[] = [];
	@Input() docente:IDocente;
	@Input() curso: ICurso;
	@Input() matriculas$: Observable<IMatricula[]>;
	@Input() periodo: IPeriodo;
	estudiantes: IEstudiante[] = [];
	checkboxEstudiantes: ICheckBoxEstudiante[] = [];

	constructor(
		private apiBoletinService: ApiBoletinService,
		private boletinPDFService: BoletinPDFService,
		public activeModal: NgbActiveModal
	) { }

	ngOnInit(): void {
		this.matriculas$.pipe(take(1)).subscribe((matriculas: IMatricula[]) => {
			this.estudiantes = matriculas
			.filter((matricula: IMatricula) => this.findBoletin(matricula.id_estudiante) > -1)
			.map((matricula: IMatricula) => matricula.estudiante);
			this.checkboxEstudiantes = this.estudiantes.map(({ id }: IEstudiante) => ({
				id,
				value: `value_${ id }`,
				checked: false
			}));
		});
	}

	getCheckBoxEstudiante(id: number): ICheckBoxEstudiante {
		const index = this.checkboxEstudiantes
		.findIndex((checkBoxEstudiante: ICheckBoxEstudiante) => checkBoxEstudiante.id === id);
		return this.checkboxEstudiantes[index];
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
		const query: any = { id, id_curso: this.curso.id, id_grado: this.curso.id_grado, id_docente: this.docente.id };
		if (this.periodo && this.periodo.id) query.id_periodo = this.periodo.id;
		return query;
	}

	private getBoletin(idEstudiante: number): IBoletin {
		const index: number = this.findBoletin(idEstudiante);
		return (index > -1) ? this.boletines[index] : null;
	}

	private findBoletin(idEstudiante: number): number {
		return this.boletines.findIndex((boletin: IBoletin) => boletin.id_estudiante === idEstudiante);
	}

}
