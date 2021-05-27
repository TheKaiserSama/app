import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-directores-grupos',
	template: `
		<app-listar-directores-grupo-admin>
		</app-listar-directores-grupo-admin>
	`,
	styleUrls: ['./directores-grupos.component.scss']
})
export class DirectoresGruposComponent implements OnInit {

	constructor() {}

	ngOnInit(): void {}

}
