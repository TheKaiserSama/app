import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertResult } from 'sweetalert2';

import { ListarDocentesComponent } from '@modules/gestion-academica/directores-grupos/listar-docentes/listar-docentes.component';
import { ApiAnioLectivoService } from '@api/api-anio-lectivo.service';
import { DirectorGrupoService } from '@services/director-grupo/director-grupo.service';
import { IAnioLectivo, IDirectorGrupo } from '@interfaces/all.interface';
import { getCurrentYear } from '@shared/helpers/transform';
import { PopUp } from '@shared/pop-up';

@Component({
	selector: 'app-asignar-director-grupo',
	templateUrl: './asignar-director-grupo.component.html',
	styleUrls: ['./asignar-director-grupo.component.scss']
})
export class AsignarDirectorGrupoComponent implements OnInit {

	directoresGrupoAsiganados$: Observable<IDirectorGrupo[]> = this.directorGrupoService.directoresGrupoAsignados$;
	currentYear: number = getCurrentYear();
	anioLectivo: IAnioLectivo;

	constructor(
		private apiAnioLectivoService: ApiAnioLectivoService,
		private directorGrupoService: DirectorGrupoService,
		private modalService: NgbModal,
		public activeModal: NgbActiveModal,
	) { }

	ngOnInit(): void {
		this.apiAnioLectivoService.getAnioLectivoPorNumero(this.currentYear)
		.pipe(take(1))
		.subscribe((anioLectivo: IAnioLectivo) => {
			this.anioLectivo = anioLectivo;
			this.directorGrupoService.getDirectoresGrupoAsignados({ id_anio_lectivo: anioLectivo.id });
		});
	}

	asignarDirector(directorGrupo: IDirectorGrupo): void {
		const { anio_lectivo, curso } = directorGrupo;
		const modalOptions: NgbModalOptions = {
			ariaLabelledBy: 'modal-basic',
			backdrop: 'static',
			keyboard: false,
			size: 'lg'
		};
		const modalRef = this.modalService.open(ListarDocentesComponent, modalOptions);
		modalRef.componentInstance.anioLectivo = anio_lectivo;
		modalRef.componentInstance.curso = curso;
	}

	eliminarDirector(directorGrupo: IDirectorGrupo): void {
		if (!directorGrupo && !directorGrupo.id) return;
		const { id_sede } = directorGrupo.curso;
		PopUp.question('Eliminar director de grupo', this.getQuestionText(directorGrupo))
		.then((results: SweetAlertResult) => {
			if (results.value) {
				this.directorGrupoService.destroyDirectorGrupo(directorGrupo.id)
				.pipe(take(1))
				.subscribe((affectedRows: number) => {
					if (affectedRows > 0) {
						this.directorGrupoService.getDirectoresGrupo();
						this.directorGrupoService.getDirectoresGrupoAsignados({ id_sede, id_anio_lectivo: this.anioLectivo.id });
					}
				});
			}
		});
	}

	private getQuestionText(directorGrupo: IDirectorGrupo): string {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = directorGrupo.docente.persona;
		const { grado, grupo } = directorGrupo.curso;
		const _docente: string = `${ primer_nombre } ${ segundo_nombre } ${ primer_apellido } ${ segundo_apellido }`;
		const _grupo: string = `${ grado.grado }° ${ grupo.descripcion }`;
		return `Eliminar a ${ _docente } como director del grupo ${ _grupo }?`;
	}

}
