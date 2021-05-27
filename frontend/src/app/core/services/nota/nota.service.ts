import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, concatMap, take } from 'rxjs/operators';
import { SweetAlertResult } from 'sweetalert2';

import { ApiNotaService } from '@api/api-nota.service';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { CalificarActividadesService } from '@services/calificar-actividades/calificar-actividades.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { SocketIoService } from '@services/socket-io/socket-io.service';
import { INotaActividad, IListNotas, IMatricula, INotaLogro, ILogro, ICurso } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class NotaService {

	private _closeModalCurso$ = new BehaviorSubject<boolean>(false);
	private _notasActividad$ = new BehaviorSubject<INotaActividad[]>([]);
	private _listNotas$ = new BehaviorSubject<IListNotas>({});
	private _resumenActividades$ = new BehaviorSubject<any[]>([]);
	private _collectionSize$ = new BehaviorSubject<number>(0);
	private _loading$ = new BehaviorSubject<boolean>(false);

	closeModalCurso$: Observable<boolean> = this._closeModalCurso$.asObservable();
	notasActividad$: Observable<INotaActividad[]> = this._notasActividad$.asObservable();
	listNotas$: Observable<IListNotas> = this._listNotas$.asObservable();
	resumenActividades$: Observable<any[]> = this._resumenActividades$.asObservable();
	collectionSize$: Observable<number> = this._collectionSize$.asObservable();
	loading$: Observable<boolean> = this._loading$.asObservable();

	matriculas$: Observable<IMatricula[]>;
	listNotasActividad: INotaActividad[] = [];
	showModalConfirm: boolean = false;
	page: number = 1;
	pageSize: number = 15;
	miColeccion: any[] = [];
	encabezados: any[] = [];
	idActividad: number;
	id_periodo: number;
	curso: ICurso;

	constructor(
		private apiNotaService: ApiNotaService,
		private authService: AuthenticationService,
		private calificarActividadesService: CalificarActividadesService,
		private formInitService: FormInitService,
		private socketIoService: SocketIoService,
	) { }

	getMatriculas(): Observable<IMatricula[]> {
		return this.calificarActividadesService.matriculas$.pipe(
			map((matriculas: IMatricula[]) => {
				if (!matriculas) return;
				
				matriculas.forEach((matricula: IMatricula) => {
					const obj: INotaActividad = {};
					const { id } = matricula.estudiante;
					obj.id_estudiante = id;
					obj.nota = 0;
					obj.crtNota = this.formInitService.getControlNota();
					if (this.findElement(id) < 0) {
						this.listNotasActividad.push(obj);
					}
				});
				this._notasActividad$.next(this.listNotasActividad);
				this.updatePropNota();
				return matriculas;
			})
		);
	}

	getEstadisticasNotas(id_actividad: number): void {
		forkJoin([
			this.apiNotaService.getNotasMasAltas(id_actividad),
			this.apiNotaService.getNotasMasBajas(id_actividad),
			this.apiNotaService.getNotaPromedio(id_actividad)
		]).subscribe((notas: any) => {
			const listNotas: IListNotas = {
				notasMaximas: notas[0],
				notasMinimas: notas[1],
				notaPromedio: notas[2]
			};
			this._listNotas$.next(listNotas);
		});
	}

	updatePropNota(): void {
		const arrayObs: Observable<any>[] = [];
		this.listNotasActividad.map((notaActividad: INotaActividad) =>
		arrayObs.push(this.apiNotaService.getOneEstudianteActividad(notaActividad.id_estudiante, this.idActividad)));

		forkJoin(arrayObs).pipe(map((notasActividad: INotaActividad[]) => {
			notasActividad.map((nota: INotaActividad) => {
				if (!nota) return;
				const index = this.findElement(nota.id_estudiante);
				if (index < 0) return;
				if (!nota.nota) {
					this.listNotasActividad[index].nota = 0;
					this.listNotasActividad[index].crtNota.setValue(0);
				} else {
					this.listNotasActividad[index].nota = nota.nota;
					this.listNotasActividad[index].crtNota.setValue(nota.nota);
				}
			})
		})).subscribe();
	}

	setStarts(id: number): void {
		if (this.getControlNota(id).value >= 0 && this.getControlNota(id).value <= 5) {
			const index = this.findElement(id);
			if (index < 0) return;
			this.listNotasActividad[index]['nota'] = this.listNotasActividad[index]['crtNota'].value;
		}
	}

	getPos(id: number): number {
		return (this.findElement(id) > -1) ? this.findElement(id) : null;
	}

	getControlNota(id: number) {
		const index = this.findElement(id);
		if (index < 0) return;
		return this.listNotasActividad[index]['crtNota'];
	}

	findElement(id: number): any {
		return this.listNotasActividad.findIndex(item => item['id_estudiante'] == id);
	}

	getOneNotaActividad(idEstudiante: number, idActividad: number): Observable<INotaActividad> {
		return this.apiNotaService.getOneEstudianteActividad(idEstudiante, idActividad);
	}

	guardarNotasActividades() {
		const notas = this.listNotasActividad.map((notaActividad: INotaActividad) => 
		({ ...notaActividad, id_actividad: this.idActividad }));

		const data = {
			persona: this.authService.currentUserValue.persona,
			notas: notas
		};
		
		this.apiNotaService.createNotasActividad(data).subscribe((notas: IListNotas) => {
			this.socketIoService.emit('sendNotificacion', notas.notas);
			this._listNotas$.next(notas);
			this.getMatriculas();
			this.showModalConfirm = false;
			PopUp.success('Guardadas!', 'Actividades guardadas.').
			then((result: SweetAlertResult) => {});
		});
	}

	resumenActividades(id_logro: number): void {
		this.setResumenActividades([]);
		this._loading$.next(true);

		this.apiNotaService.createNotasLogro(this.curso, id_logro).pipe(
			concatMap((notasLogros: INotaLogro[]) => this.apiNotaService.getNotasActividadesPorLogro(this.curso, id_logro))
		).subscribe((resumenActividades: any) => {
			console.log(resumenActividades);
			[, this.encabezados] = resumenActividades;
			this.miColeccion = resumenActividades[0].map((item: any, i: number) => ({ ...item, index: i + 1}));

			const arraySplice = this.spliceStore(this.miColeccion);
			this.setResumenActividades([ arraySplice, this.encabezados ]);
			this._collectionSize$.next(this.miColeccion.length);
			this._loading$.next(false);
		});
	}

	resumenLogros(id_docente: number): void {
		const arrayObs: Observable<any>[] = [];
		this.setResumenActividades([]);
		this._loading$.next(true);

		this.calificarActividadesService.logros$.pipe(
			map((logros: ILogro[]) => {
				logros.map((logro: ILogro) => arrayObs.push(this.apiNotaService.createNotasLogro(this.curso, logro.id)));
			}),
			take(1)
		).subscribe();

		forkJoin(arrayObs).pipe(
			concatMap((res: any) => 
				this.apiNotaService.getNotasPorLogros(this.curso, this.calificarActividadesService.planDocente.id)),
			take(1)
		)
		.subscribe((resumenLogros: any) => {
			[, this.encabezados] = resumenLogros;
			this.miColeccion = resumenLogros[0].map((item: any, i: number) => ({ ...item, index: i + 1}));

			const arraySplice = this.spliceStore(this.miColeccion);
			this.setResumenActividades([ arraySplice, this.encabezados ]);
			this._collectionSize$.next(this.miColeccion.length);
			this._loading$.next(false);
		});
	}

	getEstadisticasLogros(): Observable<any> {
		return this.apiNotaService.getNotasPorLogros(this.curso, this.calificarActividadesService.planDocente.id);
	}

	getEstadisticasActividades(id_logro: number): Observable<any> {
		return this.apiNotaService.getNotasActividadesPorLogro(this.curso, id_logro);
	}

	spliceStore(store: any[]): any[] {
		return store.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
	}
	
	validateOffset(): number {
		const offset = (this.page - 1) * this.pageSize + this.pageSize;
		return offset > this.miColeccion.length ? this.miColeccion.length : offset;
	}

	updateTable(): void {
		this.setResumenActividades([this.spliceStore(this.miColeccion), this.encabezados]);
	}

	resetNotas(): void {
		this.listNotasActividad = [];
		this._notasActividad$.next(this.listNotasActividad);
		this.idActividad = -1;
		this.showModalConfirm = false;
	}

	setResumenActividades(resumenActividades: any): void {
		this._resumenActividades$.next(resumenActividades);
	}

	setOpenModalCurso(value: boolean): void {
		this._closeModalCurso$.next(value);
	}

}
