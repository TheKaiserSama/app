import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { NotaService } from '@services/nota/nota.service';

@Component({
	selector: 'app-listar-resumen-logros',
	templateUrl: './listar-resumen-logros.component.html',
	styleUrls: ['./listar-resumen-logros.component.scss']
})
export class ListarResumenLogrosComponent implements OnInit {

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

	constructor(public notaService: NotaService) { }

	ngOnInit(): void {
		this.notaService.getEstadisticasLogros()
		.pipe(take(1))
		.subscribe(([estudiantes]) => {
			const notaMayor = Math.max.apply(Math, estudiantes.map((estudiante) => estudiante.nota ));
			const notaMenor = Math.min.apply(Math, estudiantes.map((estudiante) => estudiante.nota ));
			const notas: number[] = estudiantes.map(estudiante => estudiante.nota);
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