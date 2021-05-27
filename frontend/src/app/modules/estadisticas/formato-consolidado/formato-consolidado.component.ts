import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { take } from 'rxjs/operators';

import { ApiConsolidadoService } from '@api/api-consolidado.service';
import { ConsolidadoService } from '@services/consolidado/consolidado.service';
import {
	ICurso,
	IDirectorGrupo,
	IPeriodo,
	IConsolidado,
	IConsolidadoHeader,
	IConsolidadoNotasEstudiante,
	IConsolidadoDatos,
	IConsolidadoEstudiante,
	ICreateUpdateConsolidado,
	IPersona
} from '@interfaces/all.interface';
import { HEADER_INSTITUCION, DIRECTIVOS_INSTITUCION } from '@shared/helpers/info-institucional';

@Component({
	selector: 'app-formato-consolidado',
	templateUrl: './formato-consolidado.component.html',
	styleUrls: ['./formato-consolidado.component.scss']
})
export class FormatoConsolidadoComponent implements OnInit {

	HEADER_INSTITUCION = HEADER_INSTITUCION;
	@Input() curso: ICurso;
	@Input() periodo: IPeriodo;
	@Input() directorGrupo: IDirectorGrupo;
	consolidado: IConsolidado;
	encabezados: string[] = [];
	notasEstudiantes: IConsolidadoNotasEstudiante[] = [];
	consolidadoEstudiantes: IConsolidadoEstudiante[] = [];

	constructor(
		private apiConsolidadoService: ApiConsolidadoService,
		private consolidadoService: ConsolidadoService,
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit(): void {
		const { id: id_curso, id_grado, id_anio_lectivo } = this.curso;
		const consolidadoParams = {
			id_anio_lectivo,
			id_curso,
			id_director_grupo: this.directorGrupo.id,
			id_grado,
		};
		if (this.periodo && this.periodo.id) {
			consolidadoParams['id_periodo'] = this.periodo.id
			this.apiConsolidadoService.getConsolidadoPorPeriodo(consolidadoParams)
			.subscribe((datos: IConsolidadoDatos) => {
				this.consolidado = datos.consolidado;
				this.consolidadoEstudiantes = datos.consolidado_estudiantes;
				this.encabezados = this.getEncabezados(datos.encabezados);
				this.notasEstudiantes = datos.notas_estudiantes;
			});
		} else {
			this.apiConsolidadoService.getConsolidadoFinal(consolidadoParams)
			.subscribe((datos: IConsolidadoDatos) => {
				this.consolidado = datos.consolidado;
				this.consolidadoEstudiantes = datos.consolidado_estudiantes;
				this.encabezados = this.getEncabezados(datos.encabezados)
				this.notasEstudiantes = datos.notas_estudiantes;
			});
		}
	}

	getEncabezados(encabezados: IConsolidadoHeader[]): string[] {
		const headerTabla: string[] = ['ITEM', 'NOMBRES Y APELLIDOS'];
		encabezados.forEach(encabezado => headerTabla.push(encabezado.abreviatura));
		return headerTabla;
	}

	guardarConsolidado(): void {
		if (this.consolidado && this.consolidado.id) {
			const { id } = this.consolidado;
			const infoConsolidado: ICreateUpdateConsolidado = {
				info_consolidado: { observaciones: this.consolidado.observaciones },
				info_consolidados_estudiantes: [ ...this.consolidadoEstudiantes ]
			};

			this.consolidadoService.updateConsolidado(id, infoConsolidado)
			.pipe(take(1))
			.subscribe((shouldCloseModal) => {
				if (shouldCloseModal) this.activeModal.close();
			});
		} else {
			const { id: id_curso, id_anio_lectivo } = this.curso;
			const infoConsolidado: ICreateUpdateConsolidado = {
				info_consolidado: {
					observaciones: this.consolidado.observaciones,
					rector: DIRECTIVOS_INSTITUCION.rector.nombre,
					coordinador: DIRECTIVOS_INSTITUCION.coordinador.nombre,
					id_anio_lectivo,
					id_curso,
					id_director_grupo: this.directorGrupo.id,
					id_periodo: this.periodo.id,
				},
				info_consolidados_estudiantes: [ ...this.consolidadoEstudiantes ]
			};

			this.consolidadoService.createConsolidado(infoConsolidado)
			.pipe(take(1))
			.subscribe((shouldCloseModal) => {
				if (shouldCloseModal) this.activeModal.close();
			});
		}
	}

	downloadExcelConsolidado(): void {
		this.consolidadoService.downloadExcelConsolidado(this.curso, this.periodo, this.directorGrupo);
	}

	getPeriodoConsolidado(): string {
		return (this.periodo && this.periodo.numero) ? `Consolidado de Notas Periodo ${ this.periodo.numero }` : 'Consolidado de Notas Finales';
	}

	openModalObservaciones(): void {
		Swal.fire({
			text: 'Escriba las observaciones',
			input: 'textarea',
			inputValue: this.consolidado?.observaciones || '',
			showCancelButton: true,
			confirmButtonText: 'Guardar',
			cancelButtonText: 'Cancelar',
			allowOutsideClick: false,
			allowEscapeKey: false
		}).then((result) => {
			if (result.isConfirmed)
				this.consolidado.observaciones = result.value;
		});
	}

	openModalObservacionesEstudiante(id: number): void {
		const index: number = this.findConsolidadoEstudiante(id);
		Swal.fire({
			text: 'Escriba las observaciones',
			input: 'textarea',
			inputValue: this.consolidadoEstudiantes[index]?.observaciones || '',
			showCancelButton: true,
			confirmButtonText: 'Guardar',
			cancelButtonText: 'Cancelar',
			allowOutsideClick: false,
			allowEscapeKey: false
		}).then((result) => {
			if (result.isConfirmed)
				this.consolidadoEstudiantes[index].observaciones = result.value;
		});
	}

	getConsolidadoEstudiante(id: number): IConsolidadoEstudiante {
		const index: number = this.findConsolidadoEstudiante(id);
		return (index > -1) ? this.consolidadoEstudiantes[index] : null;
	}

	findConsolidadoEstudiante(id: number): number {
		return this.consolidadoEstudiantes.findIndex((consolidado) => consolidado.id_estudiante == id);
	}

	getFullName(persona: IPersona): string {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = persona;
		return `${ primer_apellido || '' } ${ segundo_apellido || '' } ${ primer_nombre || '' } ${ segundo_nombre || '' }`
	}

}
