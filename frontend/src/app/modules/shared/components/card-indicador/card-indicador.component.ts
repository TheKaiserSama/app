import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-card-indicador',
	templateUrl: './card-indicador.component.html',
	styleUrls: ['./card-indicador.component.scss']
})
export class CardIndicadorComponent implements OnInit {

	@Input() values;
	@Input() styles;
	
	constructor() { }

	ngOnInit(): void { }

}