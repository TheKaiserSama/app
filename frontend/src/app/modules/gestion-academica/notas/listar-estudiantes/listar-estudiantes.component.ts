import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { CalificarActividadesService } from '@services/calificar-actividades/calificar-actividades.service';
import { NotaService } from '@services/nota/nota.service';
import { IMatricula, INotaActividad } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-estudiantes',
	templateUrl: './listar-estudiantes.component.html',
	styleUrls: ['./listar-estudiantes.component.scss']
})
export class ListarEstudiantesComponent implements OnInit, OnDestroy {

	matriculas$: Observable<IMatricula[]> = this.notaService.getMatriculas();
	notasActividad$: Observable<INotaActividad[]> = this.notaService.notasActividad$;

	constructor(
		public calificarActividadesService: CalificarActividadesService,
		public notaService: NotaService,
	) { }

	ngOnInit(): void {
		this.calificarActividadesService.getMatriculaByIdCurso();
	}

	ngOnDestroy(): void {
		this.notaService.resetNotas();
	}

}