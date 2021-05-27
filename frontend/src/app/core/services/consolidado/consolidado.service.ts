import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Alignment, Workbook, Font, Cell, Worksheet, Row } from 'exceljs';
import { saveAs } from 'file-saver';
import { concatMap } from 'rxjs/operators';
import { formatNumber } from '@angular/common';
import Swal from 'sweetalert2';

import { ApiConsolidadoService } from '@api/api-consolidado.service';
import {
	IConsolidadoDatos, IConsolidadoEstudiante, IConsolidadoNotas, 
	IConsolidadoNotasEstudiante, ICreateUpdateConsolidado, ICurso, IDirectorGrupo, IPeriodo, IPersona
} from '@interfaces/all.interface';
import { HEADER_INSTITUCION } from '@shared/helpers/info-institucional';
import { PopUp } from '@shared/pop-up';

@Injectable({
	providedIn: 'root'
})
export class ConsolidadoService {

	constructor(private apiConsolidadoService: ApiConsolidadoService) { }

	createConsolidado(infoConsolidado: ICreateUpdateConsolidado): Observable<boolean> {
		Swal.fire({
			icon: 'info',
            allowOutsideClick: false,
            text: 'Por favor, espere un momento'
        });
		Swal.showLoading();

		return this.apiConsolidadoService.createConsolidado(infoConsolidado).pipe(
			concatMap((wasCreated: boolean) => {
				if (wasCreated) {
					Swal.close();
					return of(true);
				}
				return of(false);
			})
		);
	}

	updateConsolidado(id: number, infoConsolidado: ICreateUpdateConsolidado): Observable<boolean> {
		Swal.fire({
			icon: 'info',
            allowOutsideClick: false,
            text: 'Por favor, espere un momento'
        });
		Swal.showLoading();

		return this.apiConsolidadoService.updateConsolidado(id, infoConsolidado).pipe(
			concatMap(({ affectedRowsCount }) => {
				Swal.close();
				return of(true);
			})
		);
	}

	downloadExcelConsolidado(curso: ICurso, periodo: IPeriodo, directorGrupo: IDirectorGrupo) {

		const { id: id_curso, id_grado, id_anio_lectivo } = curso;
		const consolidadoParams = {
			id_anio_lectivo,
			id_curso,
			id_director_grupo: directorGrupo.id,
			id_grado,
		};
		if (periodo && periodo.id) {
			consolidadoParams['id_periodo'] = periodo.id
			this.apiConsolidadoService.getConsolidadoPorPeriodo(consolidadoParams)
			.subscribe((datos: IConsolidadoDatos) => {
				if (datos.consolidado && datos.consolidado.id)
					this.generateExcel(datos, curso, periodo);
				else
					PopUp.info('No se pudo descargar el consolidado', 'Causa: El consolidao aun no ha sido creado.');
			});
		} else
			this.apiConsolidadoService.getConsolidadoFinal(consolidadoParams)
			.subscribe((datos: IConsolidadoDatos) => {
				if (datos.consolidado && datos.consolidado.id)
					this.generateExcel(datos, curso, periodo);
				else
					PopUp.info('No se pudo descargar el consolidado', 'Causa: El consolidao aun no ha sido creado.');
			});
	}

	generateExcel(datos: IConsolidadoDatos, curso: ICurso, periodo: IPeriodo = null): void {
		//Excel Title, Header, Data
		const { nombre, niveles, sedes, resolucion, nit, ubicacion } = HEADER_INSTITUCION;
		const { consolidado, consolidado_estudiantes, encabezados, notas_estudiantes } = datos;
		const headerInstitucion: string[] = [ nombre, niveles, sedes, resolucion, nit, ubicacion ];
		const headerConsolidado: string[] = [
			`${ this.toUpperCase(this.getPeriodoConsolidado(periodo)) } CURSO ${ curso.grado.grado }° ${ curso.grupo.descripcion }`,
			`AÑO ${ curso.anio_lectivo.anio_actual }`
		];
		const headerTabla: string[] = ['ITEM', 'NOMBRES Y APELLIDOS'];
		encabezados.forEach(encabezado => headerTabla.push(encabezado.abreviatura));

		const data: (string | number)[][] = this.getData(notas_estudiantes, consolidado_estudiantes);

		//Create workbook and worksheet
		const workbook: Workbook = new Workbook();
		const worksheet: Worksheet = workbook.addWorksheet('Consolidado');

		// Header Institución
		const fontHeaderInstitucion: Partial<Font> = { name: 'Arial', size: 9, bold: true };
		const alignmentHeaderInstitucion: Partial<Alignment> = { vertical: 'middle', horizontal: 'center' };
		headerInstitucion.forEach((nameRow: string) => {
		  	const row: Row = worksheet.addRow([ nameRow ]);
			worksheet.mergeCells(row.number, 1, row.number, headerTabla.length);
			row.font = fontHeaderInstitucion;
			row.alignment = alignmentHeaderInstitucion;
			row.height = 14.25;
		});
		worksheet.getRow(1).font = { ...fontHeaderInstitucion, size: 20, bold: false };
		worksheet.getRow(1).height = 34.5;
		worksheet.getRow(4).font = { ...fontHeaderInstitucion, size: 7 };

		// Blank Row
		worksheet.addRow([]);

		// Header Consolidado
		const fontHeaderConsolidado: Partial<Font> = { name: 'Arial', size: 11, bold: true };
		const alignmentHeaderConsolidado: Partial<Alignment> = { vertical: 'middle', horizontal: 'center' };
		headerConsolidado.forEach((nameRow: string) => {
			const row: Row = worksheet.addRow([ nameRow ]);
			worksheet.mergeCells(row.number, 1, row.number, headerTabla.length);
			row.font = fontHeaderConsolidado;
			row.alignment = alignmentHeaderConsolidado;
			row.height = 14.25;
		});

		// Blank Row
		worksheet.addRow([]);

		// Header Tabla
		const headerTablaRow: Row = worksheet.addRow(headerTabla);
		headerTablaRow.eachCell((cell: Cell, colNumber: number) => {
			if (colNumber > 2) {
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FF00B0F0' },
					bgColor: { argb: 'FF0000FF' }
				};
				cell.alignment = { vertical: 'middle' };
				if (colNumber == headerTabla.length)
					cell.alignment = { horizontal: 'center' };
			} else
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
		  	cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
			cell.font = { name: 'Arial', size: 10, bold: true };
		});
		worksheet.getColumn(1).width = 5.4;
		worksheet.getColumn(2).width = 37.6;
		worksheet.getColumn(headerTabla.length).width = 14.5;

		// Data Tabla
		data.forEach((item: (string | number)[]) => {
		  	const row = worksheet.addRow(item);
			row.eachCell((cell: Cell, colNumber: number) => {
				cell.alignment = { vertical: 'middle', horizontal: 'center' };
				if (colNumber < 3) cell.font = { name: 'Arial', size: 10 };
				if (colNumber == 2) cell.alignment = { vertical: 'middle' };
			});
		});

		// Blank Row
		worksheet.addRow([]);

		// Observaciones
		const observaciones: string = this.toUpperCase(consolidado.observaciones);
		const rowObservaciones: Row = worksheet.addRow([]);
		worksheet.mergeCells(rowObservaciones.number, 1, rowObservaciones.number, headerTabla.length);
		worksheet.getCell(`A${ rowObservaciones.number }`).value = {
			richText: [
				{ font: { bold: true, size: 10, name: 'Arial' }, text: 'OBSERVACIONES: ' },
				{ font: { bold: false, size: 10, name: 'Arial', underline: false }, text: observaciones },
			]
		};

		// Blank Row
		worksheet.addRow([]);

		// Dinamizador de grupo
		const rowDinamizador: Row = worksheet.addRow([]);
		worksheet.mergeCells(rowDinamizador.number, 2, rowDinamizador.number, 6);
		worksheet.getCell(`B${ rowDinamizador.number }`).value = {
			richText: [
				{ font: { bold: true, size: 10, name: 'Arial' }, text: 'FIRMA DINAMIZADOR: ' },
				{ font: { bold: false, size: 10, name: 'Arial' }, text: '____________________________________________________' },
			]
		};

		//Generate Excel File with given name
		workbook.xlsx.writeBuffer().then((data: Buffer) => {
		  	const blob: Blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			saveAs(blob, 'consolidado.xlsx');
		});
	}
	
	private getPeriodoConsolidado(periodo: IPeriodo): string {
		return (periodo && periodo.numero) ? `Consolidado de Notas Periodo ${ periodo.numero }` : 'Consolidado de Notas Finales';
	}

	private getData(notasEstudiantes: IConsolidadoNotasEstudiante[], consolidadoEstudiantes: IConsolidadoEstudiante[]): (string | number)[][] {
		return notasEstudiantes.map((notaEstudiante: IConsolidadoNotasEstudiante, index: number) => {
			const { estudiante, faltas_totales, notas } = notaEstudiante;
			const fullName: string = this.getFullName(estudiante.persona);
			const notasAsString: string[] = this.getNotas(notas);
			const indexConsolidado: number = this.findConsolidadoEstudiante(consolidadoEstudiantes, estudiante.id);
			const observaciones: string = (indexConsolidado > -1) ? consolidadoEstudiantes[indexConsolidado].observaciones : '';
			return [
				(index + 1),
				this.toUpperCase(fullName),
				...notasAsString,
				faltas_totales.justificadas,
				faltas_totales.sin_justificar,
				observaciones
			];
		});
	}

	private toUpperCase(name: string): string {
		return name ? name.toUpperCase() : '';
	}

	private getFullName(persona: IPersona): string {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = persona;
		return `${ primer_apellido || '' } ${ segundo_apellido || '' } ${ primer_nombre || '' } ${ segundo_nombre || '' }`
	}

	private getNotas(notas: IConsolidadoNotas[]): string[] {
		return notas.map(({ nota_final }: IConsolidadoNotas) => formatNumber(nota_final, 'en-US', '1.1-1'));
	}

	private findConsolidadoEstudiante(consolidadoEstudiantes: IConsolidadoEstudiante[], id: number): number {
		return consolidadoEstudiantes.findIndex((consolidadoEstudiante: IConsolidadoEstudiante) => consolidadoEstudiante.id_estudiante == id);
	}

}
