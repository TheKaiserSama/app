import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-widget-chart',
	template: `
		<div class="widget-chart" [style.borderColor]="config?.color">
			<div class="icon-wrapper" [style.backgroundColor]="config?.color">
				<i class="{{ config?.icono }}" aria-hidden="true"></i>
			</div>
			<div class="widget-numbers">{{ config?.valor || 0 }}</div>
			<div class="widget-subheading">{{ config.titulo }}</div>
		</div>
	`,
	styleUrls: ['./widget-chart.component.scss']
})
export class WidgetChartComponent implements OnInit {

	@Input() config;

	constructor() { }
	
	ngOnInit(): void { }

}
