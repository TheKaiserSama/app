import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertResult } from 'sweetalert2';

import { ApiDocenteService } from '@api/api-docente.service';
import { DirectorGrupoService } from '@services/director-grupo/director-grupo.service';
import { IAnioLectivo, ICurso, IDirectorGrupo, IDocente } from '@interfaces/all.interface';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-listar-docentes',
	templateUrl: './listar-docentes.component.html',
	styleUrls: ['./listar-docentes.component.scss']
})
export class ListarDocentesComponent implements OnInit {

	@Input() anioLectivo: IAnioLectivo;
	@Input() curso: ICurso;
	docentes: IDocente[] = [];
	page: number = 1;
	count: number = 0;
	pageSize: number = 10;
	disabledButton: boolean = false;
	isLoading: boolean = false;

	constructor(
		private apiDocenteService: ApiDocenteService,
		private directorGrupoService: DirectorGrupoService,
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit(): void {
		this.getDocentesNoDirectoresGrupo();
	}

	getRequestParams(page: number, pageSize: number): any {
		const params: any = {};
		if (page) params[`page`] = page - 1;
		if (pageSize) params[`size`] = pageSize;
		return params;
	}

	getDocentesNoDirectoresGrupo(): void {
		this.isLoading = true;
		const params = this.getRequestParams(this.page, this.pageSize);
		this.apiDocenteService.getDocentesNoDirectoresGrupo(params)
		.subscribe(({ docentes, totalItems }) => {
			this.docentes = docentes;
			this.count = totalItems;
			this.isLoading = false;
		});
	}

	handlePageChange(page: number): void {
		this.page = page;
		this.getDocentesNoDirectoresGrupo();
	}

	handlePageSizeChange(event: any): void {
		this.pageSize = +event.target.value;
		this.page = 1;
		this.getDocentesNoDirectoresGrupo();
	}

	asignarDirector(docente: IDocente): void {
		if (!docente) return;
		PopUp.question('Asignar director grupo', this.getQuestionText(docente))
		.then((result: SweetAlertResult) => {
			if (result.value) {
				this.disabledButton = true;
				const directorGrupo: IDirectorGrupo = {
					id_anio_lectivo: this.anioLectivo.id,
					id_curso: this.curso.id,
					id_docente: docente.id,
					curso: this.curso
				};
				this.directorGrupoService.createDirectorGrupo(directorGrupo)
				.subscribe((wasCreated: boolean) => {
					this.disabledButton = false;
					let title: string = '';
					let text: string = '';
					if (!wasCreated) {
						title = 'Operación fallida';
						text = 'No se pudo asignar el director de grupo.';
					} else {
						this.directorGrupoService.getDirectoresGrupo();
						title = 'Operación exitosa';
						text = 'Director de grupo asignado exitosamente.';
					}
					
					this.directorGrupoService.getDirectoresGrupoAsignados({ id_anio_lectivo: this.anioLectivo.id });
					PopUp.info(title, text).then((result: SweetAlertResult) => {
						this.activeModal.close();
					});
				});
			}
		});
	}

	getOffset(): number {
		return (this.page - 1) * this.pageSize;
	}

	validateOffset(): number {
		const offset = this.getOffset() + this.pageSize;
		return offset > this.count ? this.count : offset;
	}

	private getQuestionText(docente: IDocente): string {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = docente.persona;
		const { grado, grupo } = this.curso;
		const _docente: string = `${ primer_nombre } ${ segundo_nombre } ${ primer_apellido } ${ segundo_apellido }`;
		const _grupo: string = `${ grado.grado }° ${ grupo.descripcion }`;
		return `¿Asignar a ${ _docente } como director del grupo ${ _grupo }?`;
	}

}
