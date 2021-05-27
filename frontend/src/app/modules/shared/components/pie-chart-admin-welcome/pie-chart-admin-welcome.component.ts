import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

import { ApiMatriculaService } from '@api/api-matricula.service';

@Component({
	selector: 'app-pie-chart-admin-welcome',
	template: `
		<div>
			<div>
				<div class="chart">
					<canvas baseChart
						[data]="pieChartData"
						[labels]="pieChartLabels"
						[chartType]="pieChartType"
						[options]="pieChartOptions"
						[plugins]="pieChartPlugins"
						[colors]="pieChartColors"
						[legend]="pieChartLegend">
					</canvas>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./pie-chart-admin-welcome.component.scss']
})
export class PieChartAdminWelcomeComponent implements OnInit {

	pieChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			position: 'top',
		},
		plugins: {
			datalabels: {
				formatter: (value, ctx) => {
					const label = ctx.chart.data.labels[ctx.dataIndex];
					return label;
				},
			},
		}
	};
	pieChartLabels: Label[] = [];
	pieChartData: number[] = [];
	pieChartType: ChartType = 'pie';
	pieChartLegend = true;
	pieChartPlugins = [pluginDataLabels];
	pieChartColors = [{ 
		backgroundColor: [
			'rgba(0,0,255,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,255,0,0.3)',
			'rgba(163,228,215,1)', 'rgba(249,231,159,1)', 'rgba(195,155,211,1)'
		],
	}];

	constructor(private apiMatriculaService: ApiMatriculaService) { }

	ngOnInit(): void {
		this.apiMatriculaService.getCountMatriculasPorSede()
		.pipe(take(1))
		.subscribe(datos => {
			this.pieChartLabels = datos.map(dato => dato.nombre);
			this.pieChartData = datos.map(dato => dato.cantidad_matriculas);
		});
	}

}
