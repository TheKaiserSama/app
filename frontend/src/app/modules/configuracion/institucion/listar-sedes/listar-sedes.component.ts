import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { SedeService } from '@services/sede/sede.service';
import { ISede } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-sedes',
	templateUrl: './listar-sedes.component.html',
	styleUrls: ['./listar-sedes.component.scss']
})
export class ListarSedesComponent implements OnInit {

	sedes$: Observable<ISede[]> = this.sedeService.sedes$;
	
	constructor(public sedeService: SedeService) { }

	ngOnInit(): void {
		this.sedeService.getSedes();
	}

	updateSede(sede: ISede): void {
		this.sedeService.setSede(sede);
		this.sedeService.shouldCreate(false);
	}

	destroySede(sede: ISede): void {
		PopUp.warning('Estas seguro?', 'La sede se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.sedeService.destroySede(sede.id)
			.pipe(take(1))
			.subscribe((res: any) => {
				if (!res) return;
				this.sedeService.shouldCreate(true);
				this.sedeService.setSede(null);
			});
		});
	}

}