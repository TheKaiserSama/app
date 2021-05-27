import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, forkJoin } from 'rxjs';
import { takeUntil, map, take } from 'rxjs/operators';

import { ApiOtrosService } from '@api/api-otros.service';
import { DocenteService } from '@services/docente/docente.service';
import { FormInitService } from '@services/form-init/form-init.service';
import { IDocente, IEstadoDocente } from '@interfaces/all.interface';
import { ngbDateToString, stringToNgbDateStruct, compareFn, getCurrentDate } from '@shared/helpers/transform';
import { ESTADO_DOCENTE } from '@shared/const';

@Component({
	selector: 'app-info-academica-docente',
	templateUrl: './info-academica-docente.component.html',
	styleUrls: ['./info-academica-docente.component.scss']
})
export class InfoAcademicaDocenteComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();
	@Input() button: any;
	@Output() changeTab = new EventEmitter<number>();
	@Output() emitDocente = new EventEmitter<IDocente>();
    formDocente: FormGroup;
    estadosDocente$: Observable<IEstadoDocente[]>;
	controls = {};
	compareFn = compareFn;

	constructor(
		private apiOtrosService: ApiOtrosService,
        private formInitService: FormInitService,
        public docenteService: DocenteService,
	) { }

	ngOnInit(): void {
        this.formDocente = this.formInitService.getFormDocente();
        this.initControls();
        this.initialStateForm();
        this.docenteService.infoRegistroDocente$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((docente: IDocente) => {
			if (!docente) return this.resetFormDocente();
			this.setDocente(docente);
		});
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

	private initControls(): void {
        Object.keys(this.formDocente.controls).forEach(key => {
            this.controls[key] = this.formDocente.get(key);
        });
    }

    private initialStateForm(): void {
		this.estadosDocente$ = forkJoin([
			this.apiOtrosService.getEstadosDocente(),
			this.docenteService.shouldCreate$.pipe(take(1))
		]).pipe(
			map(([estadosDocente, shouldCreate] : [IEstadoDocente[], boolean]) => {
				if (shouldCreate) {
					const index = estadosDocente.findIndex((estadoDocente: IEstadoDocente) => estadoDocente.id == ESTADO_DOCENTE.REGULAR.id);
					this.controls['estado_docente'].setValue(estadosDocente[index]);
				}
				return estadosDocente;
			})
		);
    }

	getDocente(): IDocente {
		const docente: IDocente = {};
		const _fecha_registro: NgbDate = this.controls['fecha_registro'].value;
		const _fecha_ingreso: NgbDate = this.controls['fecha_ingreso'].value;
		const fecha_registro: string = ngbDateToString(_fecha_registro);
		const fecha_ingreso: string = ngbDateToString(_fecha_ingreso);

		docente.fecha_registro = fecha_registro;
		docente.fecha_ingreso = fecha_ingreso;
		docente.titulo = this.controls['titulo'].value;
		docente.estado_docente = this.controls['estado_docente'].value;
		docente.id_estado_docente = this.controls['estado_docente'].value.id;
		docente.vigente = this.controls['vigente'].value;
		return docente;
	}

	setDocente(docente: IDocente): void {
		const { fecha_registro, fecha_ingreso } = docente;
		const _fecha_registro = stringToNgbDateStruct(fecha_registro);
		const _fecha_ingreso = stringToNgbDateStruct(fecha_ingreso);

		this.controls['fecha_registro'].setValue(_fecha_registro);
		this.controls['fecha_ingreso'].setValue(_fecha_ingreso);
		this.controls['titulo'].setValue(docente.titulo);
		this.controls['estado_docente'].setValue(docente.estado_docente);
		this.controls['vigente'].setValue(docente.vigente);
	}

	onDateSelect(date: NgbDate): void { }

	sendFormDocente(): void {
		if (this.formDocente.invalid) return;
		this.emitDocente.emit(this.getDocente());
	}

	resetFormDocente(): void {
		this.formDocente.reset();
		this.controls['vigente'].setValue(true);
		this.controls['fecha_registro'].setValue(getCurrentDate());
	}

	previousTab(): void {
		const docente = this.getDocente();
		this.docenteService.setInfoRegistroDocente(docente);
		this.docenteService.setTabActive(1);
	}

}