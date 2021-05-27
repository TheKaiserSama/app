import { IAnioLectivo } from "./anio-lectivo.interface";
import { ICurso } from "./curso.interface";
import { IDocente } from "./docente.interface";

export interface IAlmacenDirectorGrupo {
    count?: number;
    rows?: IDirectorGrupo[];
}

export interface IDirectorGrupo {
    id?: number;
    id_anio_lectivo?: number;
    id_curso?: number;
    id_docente?: number;

    anio_lectivo?: IAnioLectivo;
    curso?: ICurso;
    docente?: IDocente;
}