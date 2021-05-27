import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiLogroService } from '@api/api-logro.service';
import { NotaEstudianteService } from '@services/nota-estudiante/nota-estudiante.service';
import { ILogro } from '@interfaces/all.interface';

@Component({
	selector: 'app-modal-actividades-logro',
	templateUrl: './modal-actividades-logro.component.html',
	styleUrls: ['./modal-actividades-logro.component.scss']
})
export class ModalActividadesLogroComponent implements OnInit {

	infoLogro$: Observable<ILogro>;
	actividades$: Observable<any> = this.notaEstudianteService.actividades$;
	@Input() logro: ILogro;

	constructor(
		private apiLogroService: ApiLogroService,
		private notaEstudianteService: NotaEstudianteService
	) { }

	ngOnInit(): void {
		this.infoLogro$ = this.apiLogroService.getLogroByPk(this.logro.id);
	}

	nivelNota(nota: number): string {
		let message = '';
		switch (true) {
			case nota < 3: message = 'Bajo'; break;
			case nota >= 3 && nota < 4 : message = 'Basíco'; break;
			case nota >= 4 && nota < 4.6: message = 'Alto'; break;
			case nota >= 4.6: message = 'Superior'; break;
			default: message = '';
		}
		return message;
	}

	classNivelNota(nota: number): string {
		let classBadge = '';
		switch (true) {
			case nota < 3: classBadge = 'badge badge-danger'; break;
			case nota >= 3 && nota < 4 : classBadge = 'badge badge-warning'; break;
			case nota >= 4 && nota < 4.6: classBadge = 'badge badge-success'; break;
			case nota >= 4.6: classBadge = 'badge badge-primary'; break;
		}
		return classBadge;
	}

}