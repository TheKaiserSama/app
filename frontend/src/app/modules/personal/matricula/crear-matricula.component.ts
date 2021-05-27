import { Component, OnInit } from '@angular/core';

import { MatriculaService } from '@services/matricula/matricula.service';
import { IMatricula } from '@interfaces/all.interface';

@Component({
	selector: 'app-crear-matricula',
	template: `
		<app-info-matricula
			[button]="button"
			(emitMatricula)="handleMatricula($event)">
		</app-info-matricula>
	`,
	styles: []
})
export class CrearMatriculaComponent implements OnInit {

	button = { text: 'Crear matrícula' };

	constructor(private matriculaService: MatriculaService) { }

	ngOnInit(): void { }

	handleMatricula(matricula: IMatricula): void {
		this.matriculaService.createMatricula(matricula);
	}

}