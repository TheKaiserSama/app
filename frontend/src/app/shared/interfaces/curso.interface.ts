import { IAnioLectivo } from './anio-lectivo.interface';
import { IMateria } from './area.interface';
import { ISede } from './sede.interface';

export interface IAlmacenCurso {
    count?: number;
    rows?: ICurso[];
}

export interface IAlmacenGradoMateria {
    count?: number;
    rows?: IGradoMateria[];
}

export interface ICurso {
    id?: number;
    id_grado_grupo?: number;
    id_anio_lectivo?: number;
    id_jornada?: number;
    id_sede?: number;
    id_grado?: number;
    id_grupo?: number;
    cupo_maximo?: number;
    cupo_utilizado?: number;

    anio_lectivo?: IAnioLectivo;
    jornada?: IJornada;
    sede?: ISede;
    grado?: IGrado;
    grupo?: IGrupo;
    grado_grupo?: IGradoGrupo;
}

export interface IGrado {
    id?: number;
    grado?: string;
    vigente?: boolean;
    grupo?: IGrupo[]    
}

export interface IGrupo {
    id?: number;
    descripcion?: string;
    vigente?: boolean;
    grado_grupo?: IGradoGrupo;
}

export interface IGradoGrupo {
    id?: number;
    id_grado?: number;
    id_grupo?: number;
    cupo_maximo?: number;
    cupo_utilizado?: number;

    grado?: IGrado;
    grupo?: IGrupo;
}

export interface IJornada {
    id?: number;
    nombre?: string;
    descripcion?: string;
}

export interface ICursoMateria {
    id?: number;
    valor?: number;
    id_curso?: number;
    id_materia?: number;

    curso?: ICurso;
    materia?: IMateria;
}

export interface IGradoMateria {
    id?: number;
    id_anio_lectivo?: number;
    id_grado?: number;
    id_materia?: number;
    vigente?: number;

    anio_lectivo?: IAnioLectivo;
    grado?: IGrado;
    materia?: IMateria;
}