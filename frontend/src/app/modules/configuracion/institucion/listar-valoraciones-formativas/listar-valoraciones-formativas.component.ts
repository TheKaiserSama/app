import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ValoracionFormativaService } from '@services/valoracion-formativa/valoracion-formativa.service';
import { IValoracionFormativa } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-valoraciones-formativas',
	templateUrl: './listar-valoraciones-formativas.component.html',
	styleUrls: ['./listar-valoraciones-formativas.component.scss']
})
export class ListarValoracionesFormativasComponent implements OnInit {

	valoracionesFormativas$: Observable<IValoracionFormativa[]> = this.valoracionFormativaService.valoracionesFormativas$;
	ctrVigente: FormControl = new FormControl(null);

	constructor(public valoracionFormativaService: ValoracionFormativaService) { }

	ngOnInit(): void {
		this.valoracionFormativaService.getValoracionesFormativas();
	}

	handleVigente(value: any): void {
		if (typeof(value) === 'boolean')
			this.valoracionFormativaService.getValoracionesFormativas({ vigente: value });
		else
			this.valoracionFormativaService.getValoracionesFormativas();
	}

	updateValoracionFormativa(valoracionFormativa: IValoracionFormativa): void {
		this.valoracionFormativaService.setValoracionFormativa(valoracionFormativa);
		this.valoracionFormativaService.shouldCreate(false);
	}

	deleteValoracionFormativa({ id }: IValoracionFormativa): void {
		PopUp.warning('Estas seguro?', 'La valoración formativa se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.valoracionFormativaService.destroyValoracionFormativa(id)
			.pipe(take(1))
			.subscribe((affectedRowsCount) => {
				if (!affectedRowsCount) return;
				this.valoracionFormativaService.shouldCreate(true);
				this.valoracionFormativaService.setValoracionFormativa(null);
			})
		});
	}

}
