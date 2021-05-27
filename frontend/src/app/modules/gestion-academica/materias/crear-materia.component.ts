import { Component, OnInit } from '@angular/core';

import { MateriaService } from '@services/materia/materia.service';
import { IMateria } from '@interfaces/all.interface';

@Component({
	selector: 'app-crear-materia',
	template: `
		<app-form-materia
			[estilosBoton]="estilosBoton"
			(emitMateria)="handleMateria($event)">
		</app-form-materia>
	`,
	styles: []
})
export class CrearMateriaComponent implements OnInit {

	estilosBoton = {
		class: 'btn btn-primary col-md-12',
		text: 'Crear materia',
		show: true
	};

	constructor(private materiaService: MateriaService) { }

	ngOnInit(): void { }

	handleMateria(materia: IMateria): void {
		this.materiaService.createMateria(materia);
	}

}