import { IEstudiante } from "./estudiante.interface";
import { IPlanDocente } from "./plan-docente.interface";

export interface IAlmacenInasistencia {
    count?: number;
    rows?: IInasistencia[];
}

export interface IInasistencia {
    id?: number;
    vigente?: boolean;
    fecha?: string;
    falta?: boolean;
    justificado?: boolean;
    id_estudiante?: number;
    id_plan_docente?: number;

    estudiante?: IEstudiante;
    plan_docente?: IPlanDocente;
}