import { ILogro } from './logro.interface';

export interface IAlmacenActividad {
    count?: number;
    rows?: IActividad[];
}

export interface IActividad {
    id?: number;
    index?: number;
    nombre?: string;
    descripcion?: string;
    porcentaje?: number;
    id_logro?: number;
    nota?: number;

    logro?: ILogro;
}