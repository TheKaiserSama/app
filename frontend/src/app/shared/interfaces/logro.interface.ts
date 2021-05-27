import { IPlanDocente } from './plan-docente.interface';

export interface IAlmacenLogro {
    count?: number;
    rows?: ILogro[];
}

export interface ILogro {
    id?: number;
    index?: number;
    descripcion?: string;
    porcentaje?: number;
    vigente?: boolean;
    id_plan_docente?: number;
    
    plan_docente?: IPlanDocente;
}