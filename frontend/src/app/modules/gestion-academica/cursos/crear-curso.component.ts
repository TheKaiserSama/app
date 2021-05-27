import { Component, OnInit } from '@angular/core';

import { CursoService } from '@services/curso/curso.service';
import { ICurso } from '@interfaces/all.interface';

@Component({
	selector: 'app-crear-curso',
	template: `
		<app-form-curso
			[estilosBoton]="estilosBoton"
			(emitCurso)="handleCurso($event)">
		</app-form-curso>
	`,
	styles: []
})
export class CrearCursoComponent implements OnInit {

	estilosBoton = {
		class: 'btn btn-primary col-md-12',
		text: 'Crear curso',
		show: true
	};

	constructor(private cursoService: CursoService) { }

	ngOnInit(): void { }

	handleCurso(curso: ICurso): void {
		this.cursoService.createCurso(curso);
	}

}