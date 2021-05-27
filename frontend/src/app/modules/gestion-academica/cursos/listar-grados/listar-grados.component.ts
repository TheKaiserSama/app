import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { GradoService } from '@services/grado/grado.service';
import { IGrado } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-grados',
	templateUrl: './listar-grados.component.html',
	styleUrls: ['./listar-grados.component.scss']
})
export class ListarGradosComponent implements OnInit, OnDestroy {

	grados$: Observable<IGrado[]> = this.gradoService.grados$;

	constructor(public gradoService: GradoService) { }

	ngOnInit(): void {
		this.gradoService.objParams = {};
		this.gradoService.getGrados();
	}

	ngOnDestroy(): void {
		this.gradoService.initStateGrado();
	}

	toggleSlideToggle(event: MatSlideToggleChange, grado: IGrado): void {
		if (!grado) return;
		const updateGrado: IGrado = { ...grado, vigente: event.checked };
		this.gradoService.setGrado(grado);
		this.gradoService.updateGrado(updateGrado).pipe(take(1)).subscribe();
	}

}