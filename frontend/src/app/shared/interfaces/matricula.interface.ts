import { IAnioLectivo } from './anio-lectivo.interface';
import { IEstudiante } from './estudiante.interface';
import { IPersona } from "./persona.interface";
import { ICurso } from './curso.interface';

export interface IAlmacenMatricula {
    count?: number;
    rows?: IMatricula[]
}

export interface IMatricula {
    id?: number;
    index?: number;
    fecha_registro?: string;
    vigente?: boolean;
    id_estado_matricula?: number;
    id_estudiante?: number;
    id_anio_lectivo?: number;
    id_curso?: number;

    estado_matricula?: IEstadoMatricula;
    estudiante?: IEstudiante;
    anio_lectivo?: IAnioLectivo;
    curso?: ICurso;
    // acudiente?: IPersona;
    // info_estudiante?: IEstudiante;
    // persona?: IPersona;
}

export interface IEstadoMatricula {
    id?: number;
    descripcion?: string;
}