import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { take } from 'rxjs/operators';

import { ApiMatriculaService } from '@api/api-matricula.service';
import { getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-bar-chart-admin-welcome',
	template: `
		<div>
			<div>
				<div style="display: block">
					<canvas baseChart
						[datasets]="barChartData"
						[labels]="barChartLabels"
						[options]="barChartOptions"
						[plugins]="barChartPlugins"
						[legend]="barChartLegend"
						[chartType]="barChartType">
					</canvas>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./bar-chart-admin-welcome.component.scss']
})
export class BarChartAdminWelcomeComponent implements OnInit {

	
	barChartOptions: ChartOptions = {
		responsive: true,
		// We use these empty structures as placeholders for dynamic theming.
		scales: {
			xAxes: [{}],
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true,
					stepSize: 10,
					min: 0
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
	barChartLabels: Label[] = [];
	barChartType: ChartType = 'bar';
	barChartLegend = true;
	barChartPlugins = [pluginDataLabels];
	barChartData: ChartDataSets[] = [
		{ data: [], label: 'Estudiantes matriculados' }
	];
	currenteYear: number = getCurrentYear();
	
	constructor(private apiMatriculaService: ApiMatriculaService) { }
	
	ngOnInit(): void {
		const labels = [
			(this.currenteYear - 2).toString(),
			(this.currenteYear - 1).toString(),
			this.currenteYear.toString()
		];
		this.barChartLabels = labels;
		this.apiMatriculaService.getCountMatriculasUltimosAnios()
		.pipe(take(1))
		.subscribe((countMatriculas: number[]) => this.barChartData[0].data = [ ...countMatriculas ]);
	}

}
