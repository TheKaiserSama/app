import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiInstitucionService } from '@api/api-institucion.service';
import { ApiOtrosService } from '@api/api-otros.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { ICurso, IGrado, IGrupo, IAnioLectivo, ISede, IJornada } from '@interfaces/all.interface';
import { compareFn } from '@shared/helpers/transform';

@Component({
	selector: 'app-form-curso',
	templateUrl: './form-curso.component.html',
	styleUrls: ['./form-curso.component.scss']
})
export class FormCursoComponent implements OnInit {

	@Input() estilosBoton: any;
	@Output() emitCurso = new EventEmitter<ICurso>();
	sedes$: Observable<ISede[]>;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	grupos$: Observable<IGrupo[]>;
	jornadas$: Observable<IJornada[]>;
    formCurso: FormGroup;	
	compareFn = compareFn;

	constructor(
		private formInitService: FormInitService,
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		private apiInstitucionService: ApiInstitucionService,
		private apiOtrosService: ApiOtrosService
	) { }

	ngOnInit(): void {
		this.formCurso = this.formInitService.getFormCurso();
		this.sedes$ = this.apiInstitucionService.getSedes();
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.grados$ = this.apiCursoService.getGrados({ vigente: true });
		this.grupos$ = this.apiCursoService.getGrupos({ vigente: true });
		this.jornadas$ = this.apiOtrosService.getJornadas();
	}

	getCurso(): ICurso {
		return {
			grado: this.grado.value,
			grupo: this.grupo.value,
			jornada: this.jornada.value,
			sede: this.sede.value,
			anio_lectivo: this.anio_lectivo.value,

			id_grado: this.grado.value.id,
			id_grupo: this.grupo.value.id,
			id_anio_lectivo: this.anio_lectivo.value.id,
			id_sede: this.sede.value.id,
			id_jornada: this.jornada.value.id,
			cupo_maximo: this.cupo_maximo.value
		};
	}

	setCurso(curso: ICurso) {
		const { jornada, sede, anio_lectivo, grado, grupo, cupo_maximo } = curso;
		this.grado.setValue(grado);
		this.grupo.setValue(grupo);
		this.sede.setValue(sede);
		this.jornada.setValue(jornada);
		this.anio_lectivo.setValue(anio_lectivo);
		this.cupo_maximo.setValue(cupo_maximo);
	}

	sendFormCurso() {
		if (this.formCurso.invalid) return;
		this.emitCurso.emit(this.getCurso());
	}

	resetFormCurso(): void {
		this.formCurso.reset();
	}

	get grado() { return this.formCurso.get('grado'); }
	get grupo() { return this.formCurso.get('grupo'); }
	get jornada() { return this.formCurso.get('jornada'); }
	get sede() { return this.formCurso.get('sede'); }
	get anio_lectivo() { return this.formCurso.get('anio_lectivo'); }
	get cupo_maximo() { return this.formCurso.get('cupo_maximo'); }

}