import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { take } from 'rxjs/operators';

import { AnioLectivoService } from '@services/anio-lectivo/anio-lectivo.service';
import { IAnioLectivo } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-anios-lectivos',
	templateUrl: './listar-anios-lectivos.component.html',
	styleUrls: ['./listar-anios-lectivos.component.scss']
})
export class ListarAniosLectivosComponent implements OnInit {

	aniosLectivos$: Observable<IAnioLectivo[]> = this.anioLectivoService.aniosLectivos$;

	constructor(public anioLectivoService: AnioLectivoService) { }

	ngOnInit(): void {
		this.anioLectivoService.objParams = {};
		this.anioLectivoService.getAniosLectivos();
	}

	updateAnioLectivo(anioLectivo: IAnioLectivo): void {
		if (!anioLectivo && !anioLectivo.id) return;
		this.anioLectivoService.setAnioLectivo(anioLectivo);
		this.anioLectivoService.shouldCreate(false);
	}

	destroyAnioLectivo(anioLectivo: IAnioLectivo): void {
		if (!anioLectivo && !anioLectivo.id) return;
		PopUp.warning('Estas seguro?', 'El año lectivo se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.anioLectivoService.destroyAnioLectivo(anioLectivo.id)
			.pipe(take(1))
			.subscribe((res: any) => {
				if (!res) return;
				this.anioLectivoService.setAnioLectivo(null);
				this.anioLectivoService.shouldCreate(true);
			});
		});
	}

}