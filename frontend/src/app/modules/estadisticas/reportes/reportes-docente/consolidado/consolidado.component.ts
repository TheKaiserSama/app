import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiDirectorGrupoService } from '@api/api-director-grupo.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { FormatoConsolidadoComponent } from '@modules/estadisticas/formato-consolidado/formato-consolidado.component';
import { AuthenticationService } from "@core/authentication/authentication.service";
import { IAnioLectivo, ICurso, IDocente, IPeriodo } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';
import { concatMap, map } from 'rxjs/operators';

@Component({
	selector: 'app-consolidado',
	templateUrl: './consolidado.component.html',
	styleUrls: ['./consolidado.component.scss']
})
export class ConsolidadoComponent implements OnInit {

	cursos$: Observable<ICurso[]>;
	periodos$: Observable<IPeriodo[]>;
	ctrCurso: FormControl = new FormControl(null);
	ctrPeriodo: FormControl = new FormControl({ value: null, disabled: true });
	currentYear: number = getCurrentYear();
	
	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiDirectorGrupoService: ApiDirectorGrupoService,
		private apiPeriodoService: ApiPeriodoService,
		private authService: AuthenticationService,
		private modalService: NgbModal,
	) {}

	ngOnInit(): void {
		this.getInitialData();
	}

	handleCurso(curso: ICurso): void {
		if (curso && curso.id) {
			this.ctrPeriodo.enable();
		}	
	}

	administrarConsolidado(): void {
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			windowClass: 'modal-consolidado'
		};
		const modalRef = this.modalService.open(FormatoConsolidadoComponent, modalOptions);
		modalRef.componentInstance.curso = this.ctrCurso.value;
		modalRef.componentInstance.periodo = this.ctrPeriodo.value;
		modalRef.componentInstance.directorGrupo = this.getDocente().director_grupo[0];
	}

	private getInitialData(): void {
		this.cursos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(this.currentYear)
		.pipe(
			concatMap((anioLectivo: IAnioLectivo) => 
			this.apiDirectorGrupoService.getCursosAsignadosADirector(this.getDocente().id, { id_anio_lectivo: anioLectivo.id })),
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
	}

	private getDocente(): IDocente {
		return this.authService.currentUserValue.docente;
	}

}
