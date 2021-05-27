import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiAreaService } from '@api/api-area.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiMateriaService } from '@api/api-materia.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { GradoMateriaService } from '@services/grado-materia/grado-materia.service';
import { IAnioLectivo, IArea, IGrado, IGradoMateria, IMateria } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-form-grado-materia',
	templateUrl: './form-grado-materia.component.html',
	styleUrls: ['./form-grado-materia.component.scss']
})
export class FormGradoMateriaComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    formGradoMateria: FormGroup;
	createGradoMateria: boolean;
	gradoMateria: IGradoMateria;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	areas$: Observable<IArea[]>;
	materias$: Observable<IMateria[]>;
	compareFn = compareFn;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiAreaService: ApiAreaService,
		private apiCursoService: ApiCursoService,
		private apiMateriaService: ApiMateriaService,
		private formInitService: FormInitService,
		private gradoMateriaService: GradoMateriaService,
	) { }

	ngOnInit(): void {
		this.formGradoMateria = this.formInitService.getFormGradoMateria();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.grados$ = this.apiCursoService.getGrados({ vigente: true });
		this.areas$ = this.apiAreaService.getAreas();

		this.gradoMateriaService.gradoMateria$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((gradoMateria: IGradoMateria) => {
			if (!gradoMateria) return this.resetFormGradoMateria();
			this.gradoMateria = gradoMateria;
		});
		this.gradoMateriaService.shouldCreate$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((state: boolean) => {
			this.createGradoMateria = state;
			if (!state) {
				this.setGradoMateria(this.gradoMateria);
			}
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	getGradoMateria(): any {
		return {
			anio_lectivo: this.anio_lectivo.value,
			grado: this.grado.value,
			area: this.area.value,
			materia: this.materia.value,
			vigente: this.vigente.value,

			id_anio_lectivo: this.anio_lectivo.value.id,
			id_grado: this.grado.value.id,
			id_materia: this.materia.value.id
		};
	}

	setGradoMateria(gradoMateria: IGradoMateria): void {
		const { anio_lectivo, grado, materia, materia: { area }, vigente } = gradoMateria;
		this.anio_lectivo.setValue(anio_lectivo);
		this.grado.setValue(grado);
		this.area.setValue(area);
		this.materia.setValue(materia);
		this.vigente.setValue(vigente);
	}
	
	handleArea(area: IArea): void {
		if (!area) return;
		this.materia.setValue(null);
		this.materias$ = this.apiMateriaService.getMateriasByPkArea(area.id);
	}

	sendFormGradoMateria(): void {
		if (this.formGradoMateria.invalid) return;

		if (this.createGradoMateria) {
			PopUp.question('Esta seguro/a?', `Asignará una nueva materia al grado ${ this.grado.value.grado }.`)
			.then((result: SweetAlertResult) => {
				if (result.value) {
					this.gradoMateriaService.createGradoMateria(this.getGradoMateria())
					.pipe(takeUntil(this.unsubscribe))
					.subscribe((created: boolean) => {
						this.resetFormGradoMateria();
						this.materias$ = of([]);
					});
				}
			});
			return;
		}

		PopUp.question('Esta seguro/a?', 'Editara el registro actual.')
		.then((result: SweetAlertResult) => {
			if (result.value) {
				this.gradoMateriaService.updateGradoMateria(this.getGradoMateria())
				.pipe(takeUntil(this.unsubscribe))
				.subscribe((data: any) => {
					this.resetFormGradoMateria();
					this.materias$ = of([]);
				});
			}
		});
	}

	resetFormGradoMateria(): void {
		this.formGradoMateria.reset();
		this.vigente.setValue(true);
	}

	get anio_lectivo() { return this.formGradoMateria.get('anio_lectivo'); }
	get grado() { return this.formGradoMateria.get('grado'); }
	get area() { return this.formGradoMateria.get('area'); }
	get materia() { return this.formGradoMateria.get('materia'); }
	get vigente() { return this.formGradoMateria.get('vigente'); }

}