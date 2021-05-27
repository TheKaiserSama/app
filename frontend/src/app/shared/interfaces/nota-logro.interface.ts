import { ILogro } from './logro.interface';
import { IEstudiante } from './estudiante.interface';

export interface INotaLogro {
    id?: number;
    nota?: number;
    id_logro?: number;
    id_estudiante?: number;

    logro?: ILogro;
    estudiante?: IEstudiante;
}