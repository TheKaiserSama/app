import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InfoAcademicaDocenteComponent } from '@modules/personal/docente/info-academica-docente/info-academica-docente.component';
import { DocenteService } from '@services/docente/docente.service';
import { IDocente } from '@interfaces/all.interface';

@Component({
	selector: 'app-editar-docente',
	template: `
		<app-info-academica-docente
			[button]="button"
			(emitDocente)="handleDocente($event)">
		</app-info-academica-docente>
	`,
	styles: []
})
export class EditarDocenteComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();
	@ViewChild(InfoAcademicaDocenteComponent) infoAcademicaDocenteComponent: InfoAcademicaDocenteComponent;
	button = { text: 'Editar docente' };

	constructor(private docenteService: DocenteService) { }

	ngOnInit(): void {
		setTimeout(() => {
            this.docenteService.infoRegistroDocente$
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((docente: IDocente) => {
				if (!docente) return;
				this.infoAcademicaDocenteComponent.setDocente(docente);
			});
		});
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

	handleDocente(docente: IDocente): void {
		this.docenteService.updateDocente(docente);
	}

}