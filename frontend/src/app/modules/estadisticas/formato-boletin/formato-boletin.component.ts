import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ApiBoletinService } from '@api/api-boletin.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { BoletinService } from '@services/boletin/boletin.service';
import { IBoletin, IBoletinFinal, IMatricula, IPeriodo, IValoracionCualitativa, ICreateUpdateBoletin } from '@interfaces/all.interface';
import { HEADER_INSTITUCION, FOOTER_INSTITUCION, DIRECTIVOS_INSTITUCION } from '@shared/helpers/info-institucional';
import { getCurrentYear } from '@shared/helpers/transform';

@Component({
	selector: 'app-formato-boletin',
	templateUrl: './formato-boletin.component.html',
	styleUrls: ['./formato-boletin.component.scss']
})
export class FormatoBoletinComponent implements OnInit {

	HEADER_INSTITUCION = HEADER_INSTITUCION;
	FOOTER_INSTITUCION = FOOTER_INSTITUCION;
	DIRECTIVOS_INSTITUCION = DIRECTIVOS_INSTITUCION;
	@Input() boletin: IBoletin;
	@Input() matricula: IMatricula;
	@Input() periodo: IPeriodo;
	@Input() shouldCreate: boolean;
	currentYear: number = getCurrentYear();
	valoracionesCualitativas: IValoracionCualitativa[] = [];
	notasFinales: IBoletinFinal[] = [];
	totalFaltas = {
		justificadas: 0,
		sin_justificar: 0
	};

	constructor(
		private apiBoletinService: ApiBoletinService,
		private authService: AuthenticationService,
		private boletinService: BoletinService,
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit(): void {
		const params: any = {};
		const { id_curso, id_estudiante, curso } = this.matricula;
		const { id_grado } = curso;
		if (this.boletin && this.boletin.id) params.id_boletin = this.boletin.id;
		this.apiBoletinService.getValoracionesFormativas(params)
		.subscribe((valoracionesCualitativas: IValoracionCualitativa[]) => {
			this.valoracionesCualitativas = valoracionesCualitativas;
		});

		if (this.periodo && this.periodo.id) {
			const boletinParams = { id_curso, id_grado, id_periodo: this.periodo.id };
			this.apiBoletinService.getNotasBoletinPorPeriodo(id_estudiante, boletinParams)
			.subscribe((notasFinales: IBoletinFinal[]) => {
				this.notasFinales = notasFinales;
				notasFinales.forEach(notaFinal => {
					this.totalFaltas.justificadas += notaFinal.faltas.justificadas;
					this.totalFaltas.sin_justificar += notaFinal.faltas.sin_justificar;
				});
			});
			
		} else {
			this.apiBoletinService.getNotasBoletinFinal(id_estudiante, this.matricula)
			.subscribe((notasFinales: IBoletinFinal[]) => {
				this.notasFinales = notasFinales;
				notasFinales.forEach(notaFinal => {
					this.totalFaltas.justificadas += notaFinal.faltas.justificadas;
					this.totalFaltas.sin_justificar += notaFinal.faltas.sin_justificar;
				});
			});
		}
	}

	guardarBoletin(): void {
		if (this.shouldCreate) {
			const usuario = this.authService.currentUserValue;
			const { id_anio_lectivo, id_curso, id_estudiante } = this.matricula;
			const infoBoletin: ICreateUpdateBoletin = {
				info_boletin: {
					observaciones: this.boletin.observaciones,
					rector: DIRECTIVOS_INSTITUCION.rector.nombre,
					coordinador: DIRECTIVOS_INSTITUCION.coordinador.nombre,
					id_anio_lectivo,
					id_estudiante,
					id_curso,
					id_director_grupo: usuario.docente.director_grupo[0].id,
					id_periodo: this.periodo.id,
				},
				info_valoraciones_cualitativas: [ ...this.valoracionesCualitativas ]
			};
			const boletinParams: IBoletin = {
				id_anio_lectivo,
				id_curso,
				id_director_grupo: usuario.docente.director_grupo[0].id,
				id_periodo: this.periodo.id,
			};

			this.boletinService.createBoletin(infoBoletin, boletinParams)
			.pipe(take(1))
			.subscribe((shouldCloseModal) => {
				if (shouldCloseModal) this.activeModal.close();
			});
		} else {
			const { id_boletin } = this.valoracionesCualitativas[0];
			const infoBoletin: ICreateUpdateBoletin = {
				info_boletin: { observaciones: this.boletin.observaciones },
				info_valoraciones_cualitativas: [ ...this.valoracionesCualitativas ]
			};

			this.boletinService.updateBoletin(id_boletin, infoBoletin)
			.pipe(take(1))
			.subscribe((shouldCloseModal) => {
				if (shouldCloseModal) this.activeModal.close();
			});
		}
	}

	nunca(valCuali: IValoracionCualitativa): void {
		this.valoracionesCualitativas.forEach((_valCuali: IValoracionCualitativa) => {
			if (_valCuali.id_valoracion_formativa == valCuali.id_valoracion_formativa) {
				_valCuali.a_veces = _valCuali.siempre = false;
				_valCuali.nunca = true;
			}
		});
	}

	aVeces(valCuali: IValoracionCualitativa): void {
		this.valoracionesCualitativas.forEach((_valCuali: IValoracionCualitativa) => {
			if (_valCuali.id_valoracion_formativa == valCuali.id_valoracion_formativa) {
				_valCuali.nunca = _valCuali.siempre = false;
				_valCuali.a_veces = true;
			}
		});
	}

	siempre(valCuali: IValoracionCualitativa): void {
		this.valoracionesCualitativas.forEach((_valCuali: IValoracionCualitativa) => {
			if (_valCuali.id_valoracion_formativa == valCuali.id_valoracion_formativa) {
				_valCuali.a_veces = _valCuali.nunca = false;
				_valCuali.siempre = true;
			}
		});
	}

	checkValidacionesCualitativas(): boolean {
		const index = this.valoracionesCualitativas.findIndex((valCualitativa: IValoracionCualitativa) => 
			(!valCualitativa.nunca && !valCualitativa.a_veces && !valCualitativa.siempre));
		return index > -1 ? true : false;
	}

	openModalObservaciones(): void {
		Swal.fire({
			text: 'Escriba las observaciones',
			input: 'textarea',
			inputValue: this.boletin.observaciones,
			showCancelButton: true,
			confirmButtonText: 'Guardar',
			cancelButtonText: 'Cancelar',
			allowOutsideClick: false,
			allowEscapeKey: false
		}).then((result) => {
			if (result.isConfirmed)
				this.boletin.observaciones = result.value;
		});
	}

	getPeriodoBoletin(): string {
		return (this.periodo && this.periodo.numero) ? `Periodo ${ this.periodo.numero }` : 'Boletín Final';
	}

}
