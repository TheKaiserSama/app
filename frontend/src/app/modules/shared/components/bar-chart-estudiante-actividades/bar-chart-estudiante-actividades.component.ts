import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

import { NotaEstudianteService } from '@services/nota-estudiante/nota-estudiante.service';
import { IActividad } from '@interfaces/all.interface';

@Component({
	selector: 'app-bar-chart-estudiante-actividades',
	templateUrl: './bar-chart-estudiante-actividades.component.html',
	styleUrls: ['./bar-chart-estudiante-actividades.component.scss']
})
export class BarChartEstudianteActividadesComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
	barChartLabels: Label[] = [];
	barChartType: ChartType = 'bar';
	barChartLegend = true;
	barChartPlugins = [pluginDataLabels];
	barChartData: ChartDataSets[] = [{ data: [], label: '' }];
	barChartOptions: ChartOptions = {
		responsive: true,
		// We use these empty structures as placeholders for dynamic theming.
		scales: { 
			xAxes: [{}],
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true,
					stepSize: 1,
					min: 0,
					max: 5
				}
			}]
		},
		plugins: {
		  	datalabels: {
				anchor: 'end',
				align: 'end',
		  	}
		}
	};

	constructor(private notaEstudianteService: NotaEstudianteService) { }

	ngOnInit(): void {
		this.notaEstudianteService.actividades$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((actividades: IActividad[]) => {
			if (!actividades) return;
			const copyActividades: IActividad[] = actividades.filter((actividad: IActividad) => actividad.nota);
			this.barChartData = [{
				data: copyActividades.map((actividad) => actividad.nota),
				label: 'Actividades'
			}];

			const labels = [];
			for (let i = 0; i < copyActividades.length; i++) {
				labels.push((i + 1).toString());
			}
			this.barChartLabels = labels;
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
	
}