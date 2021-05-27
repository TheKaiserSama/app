import { IMateria } from "./area.interface";
import { IAnioLectivo, IPeriodo } from "./anio-lectivo.interface";
import { ICurso } from "./curso.interface";
import { ISede } from "./sede.interface";
import { IDocente } from "./docente.interface";
import { ILogro } from './logro.interface';

export interface IAlmacenPlanDocente {
    count?: number;
    rows?: IPlanDocente[];
}

export interface IPlanDocente {
    id?: number;
    fecha_registro?: string;
    fecha_ingreso?: string;
    vigente?: boolean;
    id_materia?: number;
    id_periodo?: number;
    id_anio_lectivo?: number;
    id_curso?: number;
    id_sede?: number;
    id_docente?: number;

    materia?: IMateria;
    periodo?: IPeriodo[];
    anio_lectivo?: IAnioLectivo;
    curso?: ICurso;
    sede?: ISede;
    docente?: IDocente;
    logro?: ILogro[];
}