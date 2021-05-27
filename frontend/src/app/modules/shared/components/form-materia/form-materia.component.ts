import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { ApiAreaService } from '@api/api-area.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { IArea, IMateria } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-form-materia',
	templateUrl: './form-materia.component.html',
	styleUrls: ['./form-materia.component.scss']
})
export class FormMateriaComponent implements OnInit {

    @Input() estilosBoton: any;
    @Output() emitMateria = new EventEmitter<IMateria>();
    formMateria: FormGroup;	
	areas$: Observable<IArea[]>;
	compareFn = compareFn;
	
	constructor(
		private apiAreaService: ApiAreaService,
		private formInitService: FormInitService
	) { }

	ngOnInit(): void {
		this.formMateria = this.formInitService.getFormMateria();
		this.areas$ = this.apiAreaService.getAreas();
	}

	getMateria(): IMateria {
		return {
			nombre: this.nombre.value,
			descripcion: this.descripcion.value,
			area: this.area.value,
			id_area: this.area.value.id
		};
	}

	setMateria(materia: IMateria) {
		const { nombre, descripcion, area } = materia;
		this.nombre.setValue(nombre);
		this.descripcion.setValue(descripcion);
		this.area.setValue(area);
	}

	sendFormMateria() {
		if (this.formMateria.invalid) {
			console.log('Formulario invalido');
			return;
		}
		this.emitMateria.emit(this.getMateria());
	}

	resetFormMateria() {
		this.formMateria.reset();
	}

	get nombre() { return this.formMateria.get('nombre'); }
	get descripcion() { return this.formMateria.get('descripcion'); }
	get area() { return this.formMateria.get('area'); }
	
}