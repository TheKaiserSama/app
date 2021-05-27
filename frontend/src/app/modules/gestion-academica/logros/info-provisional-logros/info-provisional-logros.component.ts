import { Component, OnInit } from '@angular/core';
import { SweetAlertResult } from 'sweetalert2';

import { LogroService } from '@services/logro/logro.service';
import { ILogro, IPlanDocente } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-info-provisional-logros',
	templateUrl: './info-provisional-logros.component.html',
	styleUrls: ['./info-provisional-logros.component.scss']
})
export class InfoProvisionalLogrosComponent implements OnInit {

	selectedCarAcad: IPlanDocente = this.logroService.selectedCarAcad;

	constructor(public logroService: LogroService) { }

	ngOnInit(): void { }

	editLogro(logro: ILogro): void {
		this.logroService.setLogro(logro);
		this.logroService.shouldCreate(false);
	}

	removeLogro(logro: ILogro): void {
		PopUp.question('Esta seguro/a?', 'Eliminara el logro de la lista.')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.logroService.removeLogro(logro);
			if (logro.id) {
				this.logroService.addLogroToRemove(logro.id);
			}
			this.logroService.setLogro(null);
		});
	}

}