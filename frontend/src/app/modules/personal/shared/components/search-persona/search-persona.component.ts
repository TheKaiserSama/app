import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import * as customValidators from '@shared/helpers/custom-validators-form';

@Component({
	selector: 'app-search-persona',
	templateUrl: './search-persona.component.html',
	styleUrls: ['./search-persona.component.scss']
})
export class SearchPersonaComponent implements OnInit {

	@Output() numeroDocumento = new EventEmitter<string>();
	formBusqueda: FormGroup;
	soloNumeros = customValidators.soloNumeros;
	limpiarCarateresNoPermitidos = customValidators.limpiarCarateresNoPermitidos;
	
	constructor(private fb: FormBuilder) { }

	ngOnInit(): void {
		this.formBusqueda = this.fb.group({ cedula: [''] });
	}

	searchPorDocumento(): void {
		let numeroDocumento = this.cedula.value.replace(/ /g, '');
		if (!numeroDocumento) {
			return console.log('Es necesario que ingrese un numero de cedula valido');
		}
		this.numeroDocumento.emit(numeroDocumento);
	}

	get cedula(): AbstractControl {
		return this.formBusqueda.get('cedula');
	}

}