import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { InfoMatriculaComponent } from '@modules/personal/matricula/info-matricula/info-matricula.component';
import { MatriculaService } from '@services/matricula/matricula.service';
import { IMatricula } from '@interfaces/all.interface';

@Component({
	selector: 'app-editar-matricula',
	template: `
		<app-info-matricula
			[button]="button"
			(emitMatricula)="handleMatricula($event)">
		</app-info-matricula>
	`,
	styles: []
})
export class EditarMatriculaComponent implements OnInit, OnDestroy {

	@ViewChild(InfoMatriculaComponent) infoMatricula: InfoMatriculaComponent;
    private unsubscribe = new Subject();
	button = { text: 'Editar matricula' };

	constructor(private matriculaService: MatriculaService) { }

	ngOnInit(): void {
		setTimeout(() => {
            this.matriculaService.matricula$.
            pipe(takeUntil(this.unsubscribe)).
            subscribe((matricula: IMatricula) => {
				if (!matricula) return;
				this.infoMatricula.setMatricula(matricula);
			});
		});
	}

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

	handleMatricula(matricula: IMatricula): void {
		this.matriculaService.updateMatricula(matricula);
	}

}