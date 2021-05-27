import { IPlanDocente } from './plan-docente.interface';
import { IEstudiante } from './estudiante.interface';

export interface IAlmacenPlanEstudiante {
    count?: number;
    rows?: IPlanEstudiante[];
}

export interface IPlanEstudiante {
    id?: number;
    fecha_registro?: string;
    id_plan_docente?: number;
    id_estudiante?: number;

    plan_docente?: IPlanDocente;
    estudiante?: IEstudiante;
}