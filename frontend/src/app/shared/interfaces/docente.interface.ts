import { IDirectorGrupo } from './director-grupo.interface';
import { IPersona } from './persona.interface';

export interface IAlmacenDocente {
    count?: number;
    rows?: IDocente[];
}

export interface IDocente {
    id?: number;
    titulo?: string;
    fecha_registro?: string;
    fecha_ingreso?: string;
    vigente?: boolean;
    codigo?: string;
    id_estado_docente?: number;
    id_persona?: number;

    persona?: IPersona;
    estado_docente?: IEstadoDocente;
    director_grupo?: IDirectorGrupo[];
}

export interface IEstadoDocente {
    id?: number;
    descripcion?: string;
}