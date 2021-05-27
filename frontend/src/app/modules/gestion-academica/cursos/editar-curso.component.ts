import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { FormCursoComponent } from '@modules/shared/components/form-curso/form-curso.component';
import { CursoService } from '@services/curso/curso.service';
import { ICurso } from '@interfaces/all.interface';

@Component({
	selector: 'app-editar-curso',
	template: `
		<app-form-curso
			[estilosBoton]="estilosBoton"
			(emitCurso)="handleCurso($event)">
		</app-form-curso>
	`,
	styles: []
})
export class EditarCursoComponent implements OnInit {

	@ViewChild(FormCursoComponent) formCurso: FormCursoComponent;
	estilosBoton = {
		class: 'btn btn-primary col-sm-12',
		text: 'Editar curso',
		show: true
	};

	constructor(private cursoService: CursoService) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.cursoService.curso$
			.pipe(take(1))
			.subscribe((curso: ICurso) => {
				if (!curso) return;
				this.formCurso.setCurso(curso);
			});
		});
	}

	handleCurso(curso: ICurso): void {
		this.cursoService.updateCurso(curso);
	}

}