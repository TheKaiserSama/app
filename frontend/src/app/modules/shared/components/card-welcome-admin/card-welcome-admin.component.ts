import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-card-welcome-admin',
	template: `
		<div class="card-custom">
			<div class="icon" [style.backgroundColor]="styles?.color">
				<i class="{{ styles?.icono }}" aria-hidden="true"></i>
			</div>
			<div class="card-content">
				<div class="titulo">
					<span>{{ styles?.titulo }}</span>
				</div>
				<span class="resaltar-valor" [style.color]="styles?.color">{{ value | async }}</span>
			</div>
		</div>
	`,
	styleUrls: ['./card-welcome-admin.component.scss']
})
export class CardWelcomeAdminComponent implements OnInit {

	@Input() value;
	@Input() styles;

	constructor() { }

	ngOnInit(): void { }

}
