import { Component, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';

import { FormPeriodoComponent } from '@modules/shared/components/form-periodo/form-periodo.component';
import { PeriodoService } from '@services/periodo/periodo.service';
import { IPeriodo } from '@interfaces/all.interface';

@Component({
	selector: 'app-editar-periodo',
	template: `
		<app-form-periodo
			[estilosBoton]="estilosBoton"
			(emitPeriodo)="handlePeriodo($event)">
		</app-form-periodo>
	`,
	styles: []
})
export class EditarPeriodoComponent implements OnInit {

	@ViewChild(FormPeriodoComponent) formPeriodo: FormPeriodoComponent;
	estilosBoton = {
		class: 'btn btn-primary col-sm-12',
		text: 'Editar periodo',
		show: true
	};

	constructor(private periodoService: PeriodoService) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.periodoService.periodo$
			.pipe(take(1))
			.subscribe((periodo: IPeriodo) => {
				if (!periodo) return;
				this.formPeriodo.setPeriodo(periodo);
			});
		});
	}

	handlePeriodo(periodo: IPeriodo): void {
		this.periodoService.updatePeriodo(periodo);
	}

}