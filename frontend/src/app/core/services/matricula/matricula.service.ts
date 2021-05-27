import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiInasistenciaService } from '@api/api-inasistencia.service';
import { ApiMatriculaService } from '@api/api-matricula.service';
import { ApiPersonaService } from '@api/api-persona.service';
import { IPersona, IMatricula, IAlmacenMatricula, IEstudiante, IPlanDocente } from '@interfaces/all.interface';
import { VIGENTE } from '@shared/const';
import { PopUp } from '@shared/pop-up';
import { getCurrentYear } from '@shared/helpers/transform';

@Injectable({
	providedIn: 'root'
})
export class MatriculaService {

	private _matriculas$ = new BehaviorSubject<IMatricula[]>([]);
	private _matricula$ = new BehaviorSubject<IMatricula>(null);
	private _estudiante$ = new BehaviorSubject<IPersona>(null);
	private _acudiente$ = new BehaviorSubject<IPersona>(null);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _offset$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);
	private _shouldCreate$ = new BehaviorSubject<boolean>(true);
	private _closeFormMatricula$ = new BehaviorSubject<boolean>(false);
	private _tabActive$ = new BehaviorSubject<number>(1);
	matriculas$: Observable<IMatricula[]> = this._matriculas$.asObservable();
	matricula$: Observable<IMatricula> = this._matricula$.asObservable();
	estudiante$: Observable<IPersona> = this._estudiante$.asObservable();
	acudiente$: Observable<IPersona> = this._acudiente$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	offset$: Observable<number> = this._offset$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();
	shouldCreate$: Observable<boolean> = this._shouldCreate$.asObservable();
	closeFormMatricula$: Observable<boolean> = this._closeFormMatricula$.asObservable();
	tabActive$: Observable<number> = this._tabActive$.asObservable();
	estudiantesByCurso$: Observable<IMatricula[]>;
	matriculaAntesActualizar: IMatricula;
	vigente: boolean = VIGENTE.YES;
	estudianteExiste: boolean = false; // No se para que sirve
	showSearchAcudiente = true;
	// Parametros de consulta
	page: number = 1;
	pageSize: number = 10;
	searchTerm: string = '';
	idAnioLectivo: number;
	idGrado: number;
	idGrupo: number;
	
	constructor(
		private apiInasistenciaService: ApiInasistenciaService,
		private apiMatriculaService: ApiMatriculaService,
		private apiPersonaService: ApiPersonaService,
	) { }

	getPersonaAcudiente(documento: string): void {
		this.apiPersonaService.getPersonaAcudiente(documento)
		.subscribe((persona: IPersona) => {
			if (!persona) return;
			this.setAcudiente(persona);
		});
	}

	getPersonaMatricula(documento: string): void {
		this.apiPersonaService.getEstudiantePorNumeroDocumento(documento)
		.pipe(
			concatMap((estudiante: IEstudiante) => {
				if (!estudiante) return of(null);
				return this.apiPersonaService.isMatriculado(estudiante.persona.documento).pipe(
					concatMap((isMatriculado: boolean) => {
						if (isMatriculado) return of(true);
						this.setEstudiante(estudiante.persona);
						this.estudianteExiste = true;
						this.showSearchAcudiente = false;
						return this.apiPersonaService.getPersonaByPk(estudiante.id_acudiente);
					})
				);
			})
		)
		.subscribe((data: any) => {
			switch (data) {
				case null:
					this.setEstudiante(null);
					this.setAcudiente(null);
					PopUp.info('Operación exitosa!', 'El estudiante solicitado no existe.');
				break;
				case true:
					this.setEstudiante(null);
					this.setAcudiente(null);
					PopUp.info('Operación exitosa!', `El estudiante solicitado ya se encuentra matriculado para el anio lectivo ${ getCurrentYear() }.`);
				break;
				default:
					this.setAcudiente(data);
				break;
			}
		});
	}

	getMatriculas(): void {
		this.requestApiMatriculas().subscribe((matriculas: IPersona[]) =>
		this.handleSubscribeMatriculas(matriculas));
	}

	requestApiMatriculas(): Observable<IPersona[]> {
		this._loading$.next(true);
		return this.apiMatriculaService.getMatriculas(this.pageSize, this._offset$.value, this.searchTerm, this.idGrado, this.idGrupo, this.idAnioLectivo, this.vigente)
		.pipe(
			map((matriculas: IAlmacenMatricula) => {
				this._collectionSize$.next(matriculas.count);
				return matriculas.rows.map((matricula: IMatricula, index: number) =>
					({ index: this._offset$.value + index + 1, ...matricula }));
			})
		);
	}

	handleSubscribeMatriculas(matriculas: IPersona[]): void {
		this._loading$.next(false);
		this._matriculas$.next(matriculas);
	}

	getMatriculaFormato(updateMatricula: IMatricula): any {
		const previousMatricula: IMatricula = JSON.parse(JSON.stringify(this._matricula$.value));
		const acudiente: IPersona = JSON.parse(JSON.stringify(this._acudiente$.value));
		const estudiante: IPersona = JSON.parse(JSON.stringify(this._estudiante$.value));
		let currentMatricula: IMatricula;
		
		if (!previousMatricula) {
			currentMatricula = { ...updateMatricula, estudiante: { ...updateMatricula.estudiante, persona: estudiante } };
		} else {
			currentMatricula = {
				...previousMatricula, ...updateMatricula,
				curso: { ...previousMatricula.curso, ...updateMatricula.curso, id: previousMatricula.curso.id },
				estudiante: { ...previousMatricula.estudiante, ...updateMatricula.estudiante, id_acudiente: acudiente.id, persona: estudiante }
			};
		}

		return { acudiente: acudiente, matricula: currentMatricula };
	}

	getFormatoMatriculaUpdate(updateMatricula: IMatricula): any {
		const previousMatricula: IMatricula = JSON.parse(JSON.stringify(this._matricula$.value));
		const acudiente: IPersona = JSON.parse(JSON.stringify(this._acudiente$.value));
		const estudiante: IPersona = JSON.parse(JSON.stringify(this._estudiante$.value));
		return {
			acudiente,
			curso_anterior: this.matriculaAntesActualizar.curso,
			matricula: {
				...previousMatricula, ...updateMatricula,
				estudiante: { ...updateMatricula.estudiante, persona: estudiante }
			}
		}
	}

	getMatriculaByIdCurso(planDocente: IPlanDocente, { fechaNotificacion }: any = {}): void {
		this.estudiantesByCurso$ = this.apiMatriculaService.getMatriculaByIdCurso(planDocente.id_curso)
		.pipe(
			concatMap((matriculas: IMatricula[]) => {
				const arrayObs: Observable<any>[] = [];
				const _matriculas = matriculas.map((matricula: IMatricula) => {
					const params = {
						id_estudiante: matricula.estudiante.id,
						id_plan_docente: planDocente.id,
						fecha: fechaNotificacion
					};
					arrayObs.push(this.apiInasistenciaService.getInasistenciaByParams(params));
					return {
						fecha: fechaNotificacion,
						id_estudiante: matricula.estudiante.id,
						id_plan_docente: planDocente.id,
						estudiante: matricula.estudiante,
						plan_docente: planDocente,
						falta: false,
						justificado: false
					};
				});

				return forkJoin(arrayObs).pipe(map((data => {
					for (let i = 0; i < data.length; i++) {
						if (data[i].length > 0) {
							for (let j = 0; j < _matriculas.length; j++) {
								if (data[i][0].id_estudiante == _matriculas[j].id_estudiante) {
									_matriculas[j] = { ..._matriculas[j], falta: true, justificado: data[i][0].justificado };
								}
							}
						}
					}
					return _matriculas;
				})));
			})
		);
	}

	createMatricula(matricula: IMatricula): void {
		this.apiMatriculaService.createMatricula(this.getMatriculaFormato(matricula))
		.subscribe((matricula: IMatricula) => {
			this.getMatriculas();
			this.initStateCloseModal();
			PopUp.success('Creada!', 'Estudiante matriculado.')
			.then((result: SweetAlertResult) => {
				this.setTabActive(1);
				this._closeFormMatricula$.next(true);
			});
			this._closeFormMatricula$.next(false);
		});
	}

	updateMatricula(updateMatricula: IMatricula): void {
		const datos = this.getFormatoMatriculaUpdate(updateMatricula);
		this.apiMatriculaService.updateMatricula(datos)
		.subscribe((matricula: IMatricula) => {
			this.getMatriculas();
			this.initStateCloseModal();
			PopUp.success('Editado!', 'Matricula editada exitosamente.')
			.then((result: SweetAlertResult) => {
				this.setTabActive(1);
				this._closeFormMatricula$.next(true);
			});
			this._closeFormMatricula$.next(false);
		});
	}

	destroyMatricula(id: number): void {
		PopUp.warning('Estas seguro?', 'El estudiante se eliminara de manera permanente!')
		.then((result: SweetAlertResult) => {
			if (!result.value) return;
			this.apiMatriculaService.destroyMatricula(id).subscribe((data: boolean) => {
				PopUp.success('Operacion exitosa!', 'Matricula eliminada.');
				this.getMatriculas();
			});
		});
	}

	validateOffset(): number {
		const subOffset = this._offset$.value + this.pageSize;
		return subOffset > this._collectionSize$.value ? this._collectionSize$.value : subOffset;
	}

	updateTablaMatriculas(): void {
		const offset = (this.page - 1) * this.pageSize;
		this._offset$.next(offset);
		this.getMatriculas();
	}

	addEstudianteToMatricula(estudiante: IEstudiante): void {
		this._matricula$.next({
			...this._matricula$.value,
			estudiante: { ...this._matricula$.value.estudiante,
			persona: { ...this._matricula$.value.estudiante.persona, ...estudiante } } 
		});
	}

	setAcudiente(persona: IPersona): void {
		if (!persona) return this._acudiente$.next(null);
		if (!this._acudiente$.value) return this._acudiente$.next(persona);
		this._acudiente$.next({ ...this._acudiente$.value, ...persona });
	}

	setEstudiante(persona: IPersona): void {
		if (!persona) return this._estudiante$.next(null);
		if (!this._estudiante$.value) return this._estudiante$.next(persona);
		this._estudiante$.next({ ...this._estudiante$.value, ...persona });
	}

	setMatricula(matricula: IMatricula): void {
		if (!matricula) return this._matricula$.next(null);
		if (!this._matricula$.value) return this._matricula$.next(matricula);
		this._matricula$.next({
			...this._matricula$.value, ...matricula,
			estudiante: { ...matricula.estudiante, ...this._matricula$.value.estudiante }
		});
	}
	
	shouldCreate(value: boolean): void {
		this._shouldCreate$.next(value);
	}

	setTabActive(tabActive: number): void {
		this._tabActive$.next(tabActive);
	}

	initStateMatricula(): void {
		this.initStateCloseModal();
		this._matriculas$.next([]);
		this._collectionSize$.next(0);
		this._offset$.next(0);
		this._loading$.next(false);
		this.searchTerm = '';
		this.page = 1;
		this.pageSize = 10;
		this.idAnioLectivo = this.idGrado = this.idGrupo = null;
		this.vigente = VIGENTE.YES;
	}

	initStateCloseModal(): void {
		this.setAcudiente(null);
		this.setEstudiante(null);
		this.setMatricula(null);
		this.shouldCreate(true);
		this._closeFormMatricula$.next(false);
		this.setTabActive(1);
		this.estudianteExiste = false;
		this.showSearchAcudiente = true;
	}

}