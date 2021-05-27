import { Component, OnInit } from '@angular/core';

import { DocenteService } from '@services/docente/docente.service';
import { IDocente } from '@interfaces/all.interface';

@Component({
	selector: 'app-crear-docente',
	template: `
		<app-info-academica-docente
			[button]="button"
			(emitDocente)="handleDocente($event)">
		</app-info-academica-docente>
	`,
	styles: []
})
export class CrearDocenteComponent implements OnInit {

	button = { text: 'Crear docente' };

	constructor(private docenteService: DocenteService) { }

	ngOnInit(): void { }

	handleDocente(docente: IDocente): void {
		this.docenteService.createDocente(docente);
	}

}