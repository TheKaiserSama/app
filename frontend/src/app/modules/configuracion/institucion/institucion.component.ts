import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-institucion',
	template: `
		<app-info-institucion></app-info-institucion>
	`,
	styleUrls: ['./institucion.component.scss']
})
export class InstitucionComponent implements OnInit {

	constructor() { }
	
	ngOnInit(): void { }

}