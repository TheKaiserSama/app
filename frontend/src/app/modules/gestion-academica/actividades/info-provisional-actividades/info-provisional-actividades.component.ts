import { Component, OnInit } from '@angular/core';
import { SweetAlertResult } from 'sweetalert2';

import { ActividadService } from '@services/actividad/actividad.service';
import { ILogro, IActividad } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-info-provisional-actividades',
	templateUrl: './info-provisional-actividades.component.html',
	styleUrls: ['./info-provisional-actividades.component.scss']
})
export class InfoProvisionalActividadesComponent implements OnInit {

	selectedLogro: ILogro = this.actividadService.selectedLogro;

	constructor(public actividadService: ActividadService) { }

	ngOnInit(): void { }

	editActividad(actividad: IActividad): void {
		this.actividadService.setActividad(actividad);
		this.actividadService.shouldCreate(false);
	}

	removeActividad(actividad: IActividad): void {
		PopUp.question('Esta seguro/a?', 'Eliminara la actividad de la lista.')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.actividadService.removeActividad(actividad);
			if (actividad.id) {
				this.actividadService.addActividadToRemove(actividad.id);
			}
		});
	}

}