import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiPeriodoService } from '@api/api-periodo.service';
import { ConsolidadoService } from '@services/consolidado/consolidado.service';
import { IAnioLectivo, IDirectorGrupo, IPeriodo } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-vista-consolidados-administrador',
	templateUrl: './vista-consolidados-administrador.component.html',
	styleUrls: ['./vista-consolidados-administrador.component.scss']
})
export class VistaConsolidadosAdministradorComponent implements OnInit {

	@Input() directorGrupo: IDirectorGrupo;
	periodos$: Observable<IPeriodo[]>;
	ctrPeriodo: FormControl = new FormControl(null);
	currentYear: number = getCurrentYear();
	
	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiPeriodoService: ApiPeriodoService,
		private consolidadoService: ConsolidadoService,
		public activeModal: NgbActiveModal
	) { }

	ngOnInit(): void {
		this.getInitData();
	}

	downloadConsolidado(): void {
		const { curso } = this.directorGrupo;
		const periodo = this.ctrPeriodo.value;
		this.consolidadoService.downloadExcelConsolidado(curso, periodo, this.directorGrupo);
	}

	private getInitData(): void {
		this.periodos$ = this.apiAnioLectivoService.getAnioLectivoPorNumero(this.currentYear).pipe(
			concatMap((anioLectivo: IAnioLectivo) => 
			this.apiPeriodoService.getPeriodosPorAnioLectivo(anioLectivo.id))
		);
	}

}
