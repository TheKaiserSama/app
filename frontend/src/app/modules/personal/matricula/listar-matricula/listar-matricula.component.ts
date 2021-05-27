import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { ApiCursoService } from '@api/api-curso.service';
import { ApiPersonaService } from '@api/api-persona.service';
import { MatriculaService } from '@services/matricula/matricula.service';
import { IMatricula, IPersona, IAnioLectivo, IGrado, IGrupo } from '@interfaces/all.interface';

@Component({
	selector: 'app-listar-matricula',
	templateUrl: './listar-matricula.component.html',
	styleUrls: ['./listar-matricula.component.scss']
})
export class ListarMatriculaComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();
	@Output() editar = new EventEmitter<boolean>();
	matriculas$: Observable<IMatricula[]> = this.matriculaService.matriculas$;
	collectionSize$: Observable<number> = this.matriculaService.collectionSize$;
	offset$: Observable<number> = this.matriculaService.offset$;
	aniosLectivos$: Observable<IAnioLectivo[]>;
	grados$: Observable<IGrado[]>;
	grupos$: Observable<IGrupo[]>;
	filter: FormControl = new FormControl(null);
	anio_lecivo: FormControl = new FormControl(null);
	grado: FormControl = new FormControl(null);
	grupo: FormControl = new FormControl(null);

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private apiCursoService: ApiCursoService,
		private apiPersonaService: ApiPersonaService,
		public matriculaService: MatriculaService,
	) { }

	ngOnInit(): void {
		this.aniosLectivos$ = this.apiAnioLectivoService.getAniosLectivos({ vigente: true });
		this.grados$ = this.apiCursoService.getGrados({ vigente: true });
		this.grupos$ = this.apiCursoService.getGrupos({ vigente: true });
		this.matriculaService.getMatriculas();
        this.getMatriculasFilter();
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

	handleAnioMatricula(anioLectivo: IAnioLectivo): void {
		if (anioLectivo && anioLectivo.id)
			this.matriculaService.idAnioLectivo = anioLectivo.id;
		else
			this.matriculaService.idAnioLectivo = null;
		this.matriculaService.updateTablaMatriculas();
	}
	
	handleGrado(grado: IGrado): void {
		if (grado && grado.id)
			this.matriculaService.idGrado = grado.id;
		else
			this.matriculaService.idGrado = null;
		this.matriculaService.updateTablaMatriculas();
	}

	handleGrupo(grupo: IGrupo): void {
		if (grupo && grupo.id)
			this.matriculaService.idGrupo = grupo.id;
		else
			this.matriculaService.idGrupo = null;
		this.matriculaService.updateTablaMatriculas();
	}

	onChangeVigente(value: any): void {
		value = value.toLowerCase() == 'true' ? true : false;
		this.matriculaService.vigente = value;
		this.matriculaService.updateTablaMatriculas();
	}

	onChangePageSize(value: string): void {
		this.matriculaService.pageSize = +value;
		this.matriculaService.updateTablaMatriculas();
	}
	
	onPageChange(page: number): void {
		this.matriculaService.page = page;
		this.matriculaService.updateTablaMatriculas();
	}

	validateOffset(): number {
		return this.matriculaService.validateOffset();
	}

	updateMatricula(matricula: IMatricula): void {
		this.matriculaService.matriculaAntesActualizar = matricula;
		this.matriculaService.setEstudiante(matricula.estudiante.persona);
		this.matriculaService.setMatricula(matricula);
        this.apiPersonaService.getPersonaByPk(matricula.estudiante.id_acudiente)
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((acudiente: IPersona) => {
			if (!acudiente) return;
			this.matriculaService.setAcudiente(acudiente);
		});
		this.matriculaService.shouldCreate(false);
		this.editar.emit(true);
	}

	destroyMatricula(matricula: IMatricula): void {
		this.matriculaService.destroyMatricula(matricula.id);
	}

	private getMatriculasFilter(): void {
		this.filter.valueChanges
		.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((searchTerm: string) => {
				this.matriculaService.searchTerm = searchTerm.toLowerCase();
				return this.matriculaService.requestApiMatriculas();
			}),
			takeUntil(this.unsubscribe)
		)
		.subscribe((personas: IMatricula[]) =>
		this.matriculaService.handleSubscribeMatriculas(personas));
	}
	
}