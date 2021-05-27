import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { IBoletinFinal, IHeaderBoletin, IDocente, IPersona, IPrintBoletin, IValoracionCualitativa } from '@interfaces/all.interface';
import { HEADER_INSTITUCION, FOOTER_INSTITUCION, DIRECTIVOS_INSTITUCION, NIVELES_DESEMPENIO } from '@shared/helpers/info-institucional';
import { centerText } from '@shared/custom-methods-jsPDF';
import { imgDataLogoInstitucion } from '@shared/img-base64/logo-institucion';

interface IMargin {
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
}

@Injectable({
	providedIn: 'root'
})
export class BoletinPDFService {

	doc: jsPDF;
	coordYValoracionCualitativaTable: number = 300;
	coordYValoracionCuantitativaTable: number;
	coordYTitleArea: number;
	coordYTitleObservaciones: number;
	marginTitleArea: IMargin = { top: 40, bottom: 20 };
	marginTitleObservaciones: IMargin = { top: 40 };
	marginSizeHoja: IMargin = { top: 50, left: 55, right: 55 };
	pageWidth: number;
	pageHeight: number;

	constructor(private authService: AuthenticationService) {
		this.customMethodsJSPDF();
	}

	downloadBoletin(boletinEstudiante: IPrintBoletin): void {
		this.initConfigPDF();
		this.generateBoletinPDF(boletinEstudiante);
		this.doc.save('boletin');
	}

	printBoletin(boletinEstudiante: IPrintBoletin): void {
		this.initConfigPDF();
		this.generateBoletinPDF(boletinEstudiante);
		this.doc.autoPrint({ variant: 'non-conform' });
		// @ts-ignore
		this.doc.output('dataurlnewwindow', { filename: 'boletin.pdf' });
	}

	downloadBoletines(boletinesEstudiantes: IPrintBoletin[]): void {
		this.initConfigPDF();
		for (let i = 0; i < boletinesEstudiantes.length; i++) {
			this.generateBoletinPDF(boletinesEstudiantes[i]);
			if (i < boletinesEstudiantes.length - 1)
				this.doc.addPage();
		}
		this.doc.save('boletines');
	}

	printBoletines(boletinesEstudiantes: IPrintBoletin[]): void {
		this.initConfigPDF();
		for (let i = 0; i < boletinesEstudiantes.length; i++) {
			this.generateBoletinPDF(boletinesEstudiantes[i]);
			if (i < boletinesEstudiantes.length - 1)
				this.doc.addPage();
		}
		this.doc.autoPrint({ variant: 'non-conform' });
		// @ts-ignore
		this.doc.output('dataurlnewwindow', { filename: 'boletines.pdf' });
	}

	private customMethodsJSPDF(): void {
		jsPDF.API['centerText'] = centerText;
	}

	private initConfigPDF(): void {
		// @ts-ignore
		this.doc = new jsPDF({ orientation: 'portrait', format: 'legal', unit: 'px', hotfixes: ['px_scaling'] });
		this.addFonts();
		this.pageWidth = this.doc.internal.pageSize.getWidth();
		this.pageHeight = this.doc.internal.pageSize.getHeight();
	}

	private generateBoletinPDF(boletinEstudiante: IPrintBoletin): void {
		const { boletin, docente, estudiante, headerBoletin, notasFinales, valoracionesCualitativas } = boletinEstudiante;

		const img = `data:image/png;base64,${ imgDataLogoInstitucion }`;
		this.doc.addImage(img, 'PNG', 40, 20, 90, 90);
		
		this.headerInstitucional();
		this.headerBoletin(headerBoletin);
		this.setNameEstudiante(estudiante.persona);
		this.valoracionFormativaTable(valoracionesCualitativas);
		this.setTitleArea();
		this.valoracionAreaTable(notasFinales);
		this.setTitleObservaciones(boletin.observaciones);
		this.setNivelesDesempenio(boletin.observaciones);
		this.setFirmas(docente);
		this.setFooterInstitucion();
	}

	private addFonts(): void {
		this.doc.addFont('assets/fonts/Arial.ttf', 'Arial', 'normal');
		this.doc.addFont('assets/fonts/Arial-Bold.ttf', 'Arial Bold', 'bold');
		this.doc.addFont('assets/fonts/Calibri.ttf', 'Calibri', 'normal');
		this.doc.addFont('assets/fonts/Calibri-Bold.ttf', 'Calibri Bold', 'bold');
	}

	private headerInstitucional(): void {
		const { nombre, niveles, sedes, resolucion, nit, ubicacion } = HEADER_INSTITUCION;
		this.doc.setFont('Calibri Bold', 'bold').setFontSize(28);
		// this.doc.setTextColor('#B4B4B4');
		this.doc['centerText'](nombre, { align: 'center' }, 0, 50);
		this.doc.setFontSize(10);
		this.doc['centerText'](niveles, { align: 'center' }, 0, 75);
		this.doc['centerText'](sedes, { align: 'center' }, 0, 90);
		this.doc.setFontSize(9);
		this.doc['centerText'](resolucion, { align: 'center' }, 0, 105);
		this.doc.setFont('Arial Bold', 'bold');
		this.doc['centerText'](nit, { align: 'center' }, 0, 120);
		this.doc['centerText'](ubicacion, { align: 'center' }, 0, 135);
	}

	private headerBoletin(headerBoletin: IHeaderBoletin): void {
		const { anio_lectivo, sede, titulo } = headerBoletin;
		this.doc.setFont('Arial Bold', 'bold').setFontSize(12).setTextColor('#000');
		this.doc['centerText'](titulo, { align: 'center' }, 0, 195);
		this.doc['centerText'](anio_lectivo, { align: 'center' }, 0, 215);
		this.doc['centerText'](sede, { align: 'center' }, 0, 235);
	}

	private setNameEstudiante(persona: IPersona): void {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = persona;
		const nombreCompleto: string = `${ this.toUpperCase(primer_nombre) } ${ this.toUpperCase(segundo_nombre) } ${ this.toUpperCase(primer_apellido) } ${ this.toUpperCase(segundo_apellido) }`;
		this.doc.setFont('Arial Bold', 'bold').setFontSize(11);
		this.doc.text(`ALUMNO(A): ${ nombreCompleto }`, this.marginSizeHoja.left, 280);
	}

	private valoracionFormativaTable(valoracionesCualitativas: IValoracionCualitativa[]): void {
		const dataBody = valoracionesCualitativas.map((valoracionCualitativa: IValoracionCualitativa, index: number) => {
			const { nunca, a_veces, siempre, valoracion_formativa } = valoracionCualitativa;
			return [
				(index + 1) < 10 ? '0' + (index + 1) : (index + 1),
				valoracion_formativa.descripcion,
				(nunca === true) ? 'X' : '',
				(a_veces === true) ? 'X' : '',
				(siempre === true) ? 'X' : '',
			];
		});
		autoTable(this.doc, {
			startY: this.coordYValoracionCualitativaTable,
			head: [
				[
					{ content: 'Nº', rowSpan: 2, styles: { cellWidth: 41 } },
					{ content: 'VALORACIÓN FORMATIVA', rowSpan: 2 },
					{ content: 'VALORACIÓN CUALITATIVA', colSpan: 3, title: 'vc' }
				],
				[
					{ content: 'NUNCA', title: 'nunca', styles: { cellWidth: 100 }  },
					{ content: 'A VECES', title: 'aVeces', styles: { cellWidth: 100 }  },
					{ content: 'SIEMPRE', title: 'siempre', styles: { cellWidth: 100  } }
				],
			],
			body: dataBody,
			theme: 'plain',
			columnStyles: {
				0: { halign: 'center', valign: 'middle', cellPadding: 2 },
				1: { cellPadding: { top: 2, bottom: 2, left: 10, right: 10 } },
				2: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
				3: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
				4: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
			},
			didParseCell: data => {
				if (data.section === 'head') {
					data.cell.styles.lineColor = [0, 0, 0];
					data.cell.styles.lineWidth = 0.1;
					data.cell.styles.halign = 'center';
					data.cell.styles.valign = 'middle';
					data.cell.styles.cellPadding = 2;
					data.cell.styles.font = 'Arial Bold';
					data.cell.styles.fontSize = 10;
					if (data.cell.raw['title'] === 'vc' )
						data.cell.styles.fillColor = '#4F81BD';

					if (data.cell.raw['title'] === 'nunca' || data.cell.raw['title'] === 'aVeces' || data.cell.raw['title'] === 'siempre')
						data.cell.styles.font = 'Arial';
						data.cell.styles.minCellHeight = 20;
				}

				if (data.section === 'body') {
					data.cell.styles.lineColor = [0, 0, 0];
					data.cell.styles.lineWidth = 0.1;
					data.cell.styles.minCellHeight = 23;
					data.cell.styles.valign = 'middle';
				}
			},
			didDrawPage: data => {
				const headHeight: number = data.table.head[0].cells[0].height;
				const bodyHeight: number = data.table.body.map(row => row.height).reduce((accumulator, currentValue) => accumulator + currentValue);
				this.coordYTitleArea = this.coordYValoracionCualitativaTable + headHeight + bodyHeight + this.marginTitleArea.top;
				this.coordYValoracionCuantitativaTable = this.coordYTitleArea + this.marginTitleArea.bottom;
			}
		});
	}

	private setTitleArea(): void {
		const text = 'VALORACIÓN POR ÁREA';
		this.doc.setFont('Arial Bold', 'bold').setFontSize(12);
		this.doc['centerText'](text, { align: 'center' }, 0, this.coordYTitleArea);
	}

	private valoracionAreaTable(notasFinales: IBoletinFinal[]): void {
		const totalFaltas = {
			justificadas: 0,
			sin_justificar: 0
		};
		const dataBody = notasFinales.map((notaFinal: IBoletinFinal, index: number) => {
			const { faltas, materia, nota_final } = notaFinal;
			return [
				(index + 1) < 10 ? '0' + (index + 1) : (index + 1),
				materia.nombre,
				(nota_final >= 4.6 && nota_final <= 5) ? this.roundAsString(nota_final, 1) : '',
				(nota_final >= 4.0 && nota_final < 4.6) ? this.roundAsString(nota_final, 1) : '',
				(nota_final >= 3.0 && nota_final < 4.0) ? this.roundAsString(nota_final, 1) : '',
				(nota_final >= 1.0 && nota_final < 3.0) ? this.roundAsString(nota_final, 1) : '',
				(faltas.justificadas > 0) ? faltas.justificadas : '',
				(faltas.sin_justificar > 0) ? faltas.sin_justificar : '',
			];
		});
		notasFinales.forEach(notaFinal => {
			totalFaltas.justificadas += notaFinal.faltas.justificadas;
			totalFaltas.sin_justificar += notaFinal.faltas.sin_justificar;
		});
		const filaInasistencia = [
			(dataBody.length + 1), 'Total Faltas de Asistencia', '', '', '', '',
			(totalFaltas.justificadas == 0) ? '' : totalFaltas.justificadas,
			(totalFaltas.sin_justificar == 0) ? '' : totalFaltas.sin_justificar
		];
		dataBody.push(filaInasistencia);
		autoTable(this.doc, {
			startY: this.coordYValoracionCuantitativaTable,
			head: [
				[
					{ content: 'Nº', rowSpan: 3, styles: { cellWidth: 41 } },
					{ content: 'ÁREAS', rowSpan: 3 },
					{ content: 'VALORACIÓN CUANTITATIVA', colSpan: 6, title: 'vc' }
				],
				[
					{ content: 'VALORACIÓN FINAL', colSpan: 4, title: 'vf' },
					{ content: 'FALTAS', colSpan: 2, title: 'faltas' }
				],
				[
					{ content: 'D.S', title: 'D.S' },
					{ content: 'D.A', title: 'D.A' },
					{ content: 'D.B', title: 'D.B' },
					{ content: 'D.b', title: 'D.b' },
					{ content: 'JUST', title: 'JUST' },
					{ content: 'S.J', title: 'S.J' },
				]
			],
			body: dataBody,
			theme: 'plain',
			columnStyles: {
				0: { halign: 'center', valign: 'middle', cellPadding: 2 },
				1: { cellPadding: { top: 2, bottom: 2, left: 10, right: 10 } },
				2: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
				3: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
				4: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
				5: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
				6: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
				7: { halign: 'center', valign: 'middle', cellPadding: 2, fontStyle: 'bold' },
			},
			didParseCell: data => {
				if (data.section === 'head') {
					data.cell.styles.lineColor = [0, 0, 0];
					data.cell.styles.lineWidth = 0.1;
					data.cell.styles.halign = 'center';
					data.cell.styles.valign = 'middle';
					data.cell.styles.cellPadding = 2;
					data.cell.styles.font = 'Arial Bold';
					data.cell.styles.fontSize = 12;
					if (data.cell.raw['title'] === 'vc' ) {
						data.cell.styles.fillColor = '#4F81BD';
						data.cell.styles.font = 'Arial Bold';
						data.cell.styles.fontSize = 10;
					}

					if (data.cell.raw['title'] === 'vf' || data.cell.raw['title'] === 'faltas') {
						data.cell.styles.font = 'Arial Bold';
						data.cell.styles.fontSize = 8;
					}

					if (data.cell.raw['title'] === 'D.S' || data.cell.raw['title'] === 'D.A' || data.cell.raw['title'] === 'D.B' ||
						data.cell.raw['title'] === 'D.b' || data.cell.raw['title'] === 'JUST' || data.cell.raw['title'] === 'S.J') {
						data.cell.styles.font = 'Arial';
						data.cell.styles.fontSize = 8;
						data.cell.styles.cellWidth = 50;
					}
				}

				if (data.section === 'body') {
					data.cell.styles.lineColor = [0, 0, 0];
					data.cell.styles.lineWidth = 0.1;
					data.cell.styles.minCellHeight = 23;
					data.cell.styles.valign = 'middle';
				}
			},
			didDrawPage: data => {
				const headHeight = data.table.head[0].cells[0].height;
				const bodyHeight = data.table.body.map(row => row.height).reduce((accumulator, currentValue) => accumulator + currentValue);
				this.coordYTitleObservaciones = this.coordYValoracionCuantitativaTable + headHeight + bodyHeight + this.marginTitleObservaciones.top;
			}
		});
	}

	private setTitleObservaciones(observaciones: string): void {
		const title = 'OBSERVACIONES: ';
		const fontSize = 10;
		this.doc.setFont('Arial Bold', 'bold').setFontSize(fontSize);
		this.doc.text(title, this.marginSizeHoja.left, this.coordYTitleObservaciones);
		this.setDescObservaciones(title, observaciones, fontSize);
	}

	private setDescObservaciones(title: string, observaciones: string, fontSize: number): void {
		const beginDescObservacion = this.doc.getStringUnitWidth(title) * fontSize / this.doc.internal.scaleFactor + this.marginSizeHoja.left;

		this.doc.setFont('Arial', 'normal');
		let str = '';
		let shouldContinue: boolean = false;
		const splitText: string[] = observaciones.split(' ');
		for (let i = 0; i < splitText.length; i++) {
			str += splitText[i] + ' ';
			const strWidth = this.doc.getStringUnitWidth(str) * fontSize / this.doc.internal.scaleFactor;
			if (strWidth >= (this.pageWidth - beginDescObservacion - this.marginSizeHoja.right)) {
				const strArray: string[] = str.split(' ');
				strArray.splice(strArray.length - 2, 2);
				str = strArray.join(' ');
				splitText.splice(0, i);
				shouldContinue = true;
				break;
			}
		}
		this.doc.text(str, beginDescObservacion, this.coordYTitleObservaciones);

		if (shouldContinue) {
			str = '';
			let salto = 15;
			for (let i = 0; i < splitText.length; i++) {
				str += splitText[i] + ' ';
				const strWidth = this.doc.getStringUnitWidth(str) * fontSize / this.doc.internal.scaleFactor;
				if (strWidth >= (this.pageWidth - this.marginSizeHoja.left - this.marginSizeHoja.right)) {
					const strArray: string[] = str.split(' ');
					strArray.splice(strArray.length - 2, 2);
					str = strArray.join(' ');
					this.doc.text(str, this.marginSizeHoja.left, this.coordYTitleObservaciones + salto);
					splitText.splice(0, i);
					str = '';
					salto += 15;
					i = -1;
				}
			}
			this.doc.text(str, this.marginSizeHoja.left, this.coordYTitleObservaciones + salto);
		}
	}

	private setNivelesDesempenio(observaciones: string): void {
		const textArray: string[] = this.doc.splitTextToSize(observaciones, this.pageWidth - (this.marginSizeHoja.left + this.marginSizeHoja.right));
		const textHeight = this.doc.getTextDimensions(textArray[0]);
		const coordYNivelesDesempenio: number = this.coordYTitleObservaciones + textHeight.h * textArray.length + 20;
		const incrementoCoordY: number = 16;
		const { superior, alto, basico, bajo } = NIVELES_DESEMPENIO;
		const fontSize: number = 10;
		const extraLineWidth: number = 3;
		const nivelesDesempenio = [superior, alto, basico, bajo];

		this.doc.setFont('Arial', 'normal').setFontSize(fontSize).setLineDashPattern([2], 0).setDrawColor('#000');

		for (let i = 0; i < nivelesDesempenio.length; i++) {
			const tituloWidth: number = this.getTextWidth(nivelesDesempenio[i].titulo, fontSize);
			const rangoWidth: number = this.getTextWidth(nivelesDesempenio[i].rango, fontSize);
			const xRango: number = this.pageWidth - (this.marginSizeHoja.right + rangoWidth);	
			const posicionLinea: { x1: number, x2: number } = this.getLinePositon(tituloWidth, rangoWidth, extraLineWidth);
			const coordY: number = coordYNivelesDesempenio + incrementoCoordY * i;
			this.doc.text(nivelesDesempenio[i].titulo, this.marginSizeHoja.left, coordY);
			this.doc.line(posicionLinea.x1, coordY, posicionLinea.x2, coordY);
			this.doc.text(nivelesDesempenio[i].rango, xRango, coordY);
		}
	}

	private setFirmas(docente: IDocente): void {
		const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido } = docente.persona;
		const { rector, coordinador } = DIRECTIVOS_INSTITUCION;
		const nombreRector: string = `${ rector.abrev } ${ this.toUpperCase(rector.nombre) }`;
		const nombreCoordinador: string = `${ coordinador.abrev } ${ this.toUpperCase(coordinador.nombre) }`;
		const dinamizadorGrupo: string = `${ primer_nombre } ${ segundo_nombre } ${ primer_apellido } ${ segundo_apellido }`;
		const fontSize: number = 10;
		const extraLineWidth: number = 10;
		const marginFirmas: IMargin = { left: this.marginSizeHoja.left + 50, right: this.marginSizeHoja.right + 50 };

		this.doc.setFont('Arial Bold', 'bold').setFontSize(fontSize).setLineDashPattern([], 1);
		const rectorWidth: number = this.getTextWidth(nombreRector, fontSize);
		const coordinadorWidth: number = this.getTextWidth(nombreCoordinador, fontSize);
		const dinamizadorGrupoWidth: number = this.getTextWidth(dinamizadorGrupo, fontSize);
		
		const x1Rector: number = (this.pageWidth - rectorWidth) / 2;
		const x1Coordinador: number = marginFirmas.left;
		const x1DinamizadorGrupo: number = this.pageWidth - (marginFirmas.right + dinamizadorGrupoWidth + extraLineWidth * 2);

		this.doc['centerText'](nombreRector, { align: 'center' }, 0, 1100);
		this.doc.text(nombreCoordinador, (marginFirmas.left + extraLineWidth), 1200);
		this.doc.text(dinamizadorGrupo, this.pageWidth - (marginFirmas.right + dinamizadorGrupoWidth + extraLineWidth), 1200);
		
		this.doc.setFont('Arial', 'normal');
		const cargoCoordinadorWidth: number = this.getTextWidth('Coordinadora', fontSize);
		const cargoDinamizadorGrupoWidth: number = this.getTextWidth('Dinamizador de grupo', fontSize);
		const xCargoCoordinador: number = marginFirmas.left + extraLineWidth + ((coordinadorWidth - cargoCoordinadorWidth) / 2);
		const xDinamizadorGrupo: number = this.pageWidth - (marginFirmas.right + extraLineWidth + dinamizadorGrupoWidth) + ((dinamizadorGrupoWidth - cargoDinamizadorGrupoWidth) / 2);

		this.doc['centerText']('Rector', { align: 'center' }, 0, 1115);
		this.doc.text('Coordinadora', xCargoCoordinador,1215);
		this.doc.text('Dinamizador de grupo', xDinamizadorGrupo, 1215);
		
		this.doc.setDrawColor(0, 0, 0).setLineWidth(1);
		this.doc.line(x1Rector - extraLineWidth, 1085, (x1Rector + rectorWidth + extraLineWidth), 1085);
		this.doc.line(x1Coordinador, 1185, (x1Coordinador + coordinadorWidth + extraLineWidth * 2), 1185);
		this.doc.line(x1DinamizadorGrupo, 1185, (this.pageWidth - marginFirmas.right), 1185);
	}

	private setFooterInstitucion(): void {
		const { direccion, celular, correo } = FOOTER_INSTITUCION;
		this.doc.setFont('Calibri', 'normal').setFontSize(11);
		this.doc['centerText'](`Dirección: ${ direccion }`, { align: 'center' }, 0, 1280);
		this.doc.setFont('Arial Bold', 'bold').setFontSize(8);
		this.doc['centerText'](`Celular: ${ celular } Correo electrónico: ${ correo }`, { align: 'center' }, 0, 1295);
	}

	private getTextWidth(text: string, fontSize: number): number {
		return this.doc.getStringUnitWidth(text) * fontSize / this.doc.internal.scaleFactor;
	}

	private getLinePositon(tituloWidth: number, rangoWidth: number, extraLineWidth: number): { x1: number, x2: number } {
		return {
			x1: (this.marginSizeHoja.left + tituloWidth + extraLineWidth),
			x2: this.pageWidth - (this.marginSizeHoja.right + rangoWidth + extraLineWidth)
		}
	}

	private toUpperCase(name: string): string {
		return name ? name.toUpperCase() : '';
	}

	private roundAsString(value: number, precision: number): string {
		const multiplier = Math.pow(10, precision || 0);
		return (Math.round(value * multiplier) / multiplier).toFixed(1);
	}

}
