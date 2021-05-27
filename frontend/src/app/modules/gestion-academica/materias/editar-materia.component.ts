import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { FormMateriaComponent } from '@modules/shared/components/form-materia/form-materia.component';
import { MateriaService } from '@services/materia/materia.service';
import { IMateria } from '@interfaces/all.interface';

@Component({
	selector: 'app-editar-materia',
	template: `
		<app-form-materia
			[estilosBoton]="estilosBoton"
			(emitMateria)="handleMateria($event)">
		</app-form-materia>
	`,
	styles: []
})
export class EditarMateriaComponent implements OnInit {

	@ViewChild(FormMateriaComponent) formMateria: FormMateriaComponent;
	estilosBoton = {
		class: 'btn btn-primary col-sm-12',
		text: 'Editar materia',
		show: true
	};

	constructor(private materiaService: MateriaService) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.materiaService.materia$
			.pipe(take(1))
			.subscribe((materia: IMateria) => {
				if (!materia) return;
				this.formMateria.setMateria(materia);
			});
		});
	}

	handleMateria(materia: IMateria): void {
		this.materiaService.updateMateria(materia);
	}

}