import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { GrupoService } from '@services/grupo/grupo.service';
import { IGrupo } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-grupos',
	templateUrl: './listar-grupos.component.html',
	styleUrls: ['./listar-grupos.component.scss']
})
export class ListarGruposComponent implements OnInit {

	grupos$: Observable<IGrupo[]> = this.grupoService.grupos$;

	constructor(public grupoService: GrupoService) { }

	ngOnInit(): void {
		this.grupoService.objParams = {};
		this.grupoService.getGrupos();
	}

	updateGrupo(grupo: IGrupo): void {
		this.grupoService.setGrupo(grupo);
		this.grupoService.shouldCreate(false);
	}

	destroyGrupo(grupo: IGrupo): void {
		PopUp.warning('Estas seguro?', 'El grupo se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.grupoService.destroyGrupo(grupo.id)
			.pipe(take(1))
			.subscribe((res: any) => {
				if (!res) return;
				this.grupoService.shouldCreate(true);
				this.grupoService.setGrupo(null);
			});
		});
	}

}