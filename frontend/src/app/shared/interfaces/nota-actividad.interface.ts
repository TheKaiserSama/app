import { IActividad } from './actividad.interface';
import { IEstudiante } from './estudiante.interface';
import { FormControl } from '@angular/forms';

export interface IListNotas {
    notaPromedio?: any;
    notas?: INotaActividad;
    notasMaximas?: IEstudiante[];
    notasMinimas?: IEstudiante[];
}

export interface INotaActividad {
    id?: number;
    nota?: number;
    id_actividad?: number;
    id_estudiante?: number;
    crtNota?: FormControl;

    actividad?: IActividad;
    estudiante?: IEstudiante;
}