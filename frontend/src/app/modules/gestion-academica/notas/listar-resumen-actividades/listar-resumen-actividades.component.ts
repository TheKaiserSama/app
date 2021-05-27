import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotaService } from '@services/nota/nota.service';
import { ILogro } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-resumen-actividades',
	templateUrl: './listar-resumen-actividades.component.html',
	styleUrls: ['./listar-resumen-actividades.component.scss']
})
export class ListarResumenActividadesComponent implements OnInit {

	@Input() logro: ILogro;
	storeResumenActividades$: Observable<any> = this.notaService.resumenActividades$;
	collectionSize$: Observable<number> = this.notaService.collectionSize$;
	configMax = {
		titulo: 'NOTA MÁS ALTA',
		icono: 'fa fa-smile-o',
		color: '#00A65A',
	};
	configPro = {
		titulo: 'NOTA PROMEDIO',
		icono: 'fa fa-bar-chart',
		color: '#F39C12'
	};
	configMin = {
		titulo: 'NOTA MÁS BAJA',
		icono: 'fa fa-frown-o',
		color: '#DD4B39'
	};

	constructor(
		public activeModal: NgbActiveModal,
		public notaService: NotaService,
	) { }

	ngOnInit(): void {
		this.notaService.getEstadisticasActividades(this.logro.id)
		.pipe(take(1))
		.subscribe(([estudiantes]) => {
			const notaMayor = Math.max.apply(Math, estudiantes.map((estudiante) => +estudiante.logro ));
			const notaMenor = Math.min.apply(Math, estudiantes.map((estudiante) => +estudiante.logro ));
			const notas: number[] = estudiantes.map(estudiante => +estudiante.logro);
			const acumulado = notas.reduce((accumulator, currentValue) => accumulator + currentValue);
			let notaPromedio = 0;
			if (estudiantes.length > 0) {
				notaPromedio = acumulado / estudiantes.length;
				notaPromedio = Math.round((notaPromedio + Number.EPSILON) * 100) / 100;
			}
			this.configMax['valor'] = notaMayor;
			this.configPro['valor'] = notaPromedio;
			this.configMin['valor'] = notaMenor;
		});
	}
	
	onPageChange(page: number): void {
		this.notaService.page = page;
		this.notaService.updateTable();
	}

}