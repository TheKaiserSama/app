import { Component, OnInit } from '@angular/core';

import { PeriodoService } from '@services/periodo/periodo.service';
import { IPeriodo } from '@interfaces/all.interface';

@Component({
	selector: 'app-crear-periodo',
	template: `
		<app-form-periodo
			[estilosBoton]="estilosBoton"
			(emitPeriodo)="handlePeriodo($event)">
		</app-form-periodo>
	`,
	styles: []
})
export class CrearPeriodoComponent implements OnInit {

	estilosBoton = {
		class: 'btn btn-primary col-md-12',
		text: 'Crear periodo',
		show: true
	};

	constructor(private periodoService: PeriodoService) { }

	ngOnInit(): void { }

	handlePeriodo(periodo: IPeriodo): void {
		this.periodoService.createPeriodo(periodo);
	}

}