import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ListarCursosComponent } from './listar-cursos/listar-cursos.component';
import { CursoService } from '@services/curso/curso.service';
import { GradoService } from '@services/grado/grado.service';
import { GradoMateriaService } from '@services/grado-materia/grado-materia.service';
import { GrupoService } from '@services/grupo/grupo.service';

@Component({
	selector: 'app-cursos',
	templateUrl: './cursos.component.html',
	styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit, OnDestroy {

	@ViewChild(ListarCursosComponent) listarCursos: ListarCursosComponent;
	private unsubscribe = new Subject();
	private modalOptions: NgbModalOptions = {
        ariaLabelledBy: 'modal-basic',
        backdrop: 'static',
        keyboard: false,
		windowClass: 'modal-grado-grupo',
	};

	constructor(
		private gradoService: GradoService,
		private gradoMateriaService: GradoMateriaService,
		private grupoService: GrupoService,
		private modalService: NgbModal,
		public cursoService: CursoService,
	) { }

	ngOnInit(): void {
		this.cursoService.closeFormCurso$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((closeModal: boolean) => {
			if (closeModal) this.modalService.dismissAll();
		});
	}

	ngOnDestroy(): void {
		this.cursoService.initStateCurso();
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	openModalGrado(content: any): void {
		this.modalService.open(content, this.modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.gradoService.initStateGrado();
			this.listarCursos.reloadGrados();
        });
	}

	openModalGrupo(content: any): void {
		this.modalService.open(content, this.modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.grupoService.initStateGrupo();
        });
	}

	openFormCurso(content: any): void {
		this.modalService.open(content, this.modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.cursoService.initStateCloseModal();
        });
	}

	openCursoMateria(contentCursoMateria: any): void {
		const modalOptions: NgbModalOptions = { ...this.modalOptions, windowClass: 'modal-1200px'};
		this.modalService.open(contentCursoMateria, modalOptions).result
		.then((result: any) => { }, (reason: any) => {
            this.gradoMateriaService.initStateGradoMateria();
        });
	}

	editar(editar: boolean, content: any): void {
        if (editar) this.openFormCurso(content);
    }

}