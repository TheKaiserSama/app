import { IAnioLectivo, IPeriodo } from "./anio-lectivo.interface";
import { IMateria } from "./area.interface";
import { ICurso } from "./curso.interface";
import { IDirectorGrupo } from "./director-grupo.interface";
import { IEstudiante } from "./estudiante.interface";

export interface IAlmacenConsolidado {
    count?: number;
    rows?: IConsolidado[];
}

export interface IConsolidado {
    id?: number;
    observaciones?: string;
    rector?: string;
    coordinador?: string;
    id_curso?: number;
    id_anio_lectivo?: number;
    id_periodo?: number;
    id_director_grupo?: number;

    curso?: ICurso;
    anio_lectivo?: IAnioLectivo;
    periodo?: IPeriodo;
    director_grupo?: IDirectorGrupo;
}

export interface IConsolidadoEstudiante {
    id?: number;
    observaciones?: string;
    id_consolidado?: IConsolidado;
    id_estudiante?: IEstudiante;

    consolidado?: IConsolidado;
    estudiante?: IEstudiante;
}

export interface IConsolidadoDatos {
    consolidado?: IConsolidado;
    consolidado_estudiantes?: IConsolidadoEstudiante[];
    encabezados?: IConsolidadoHeader[];
    notas_estudiantes?: IConsolidadoNotasEstudiante[];
}

export interface IConsolidadoHeader {
    nombre?: string;
    abreviatura?: string;
}

export interface IConsolidadoNotasEstudiante {
    estudiante?: IEstudiante;
    notas?: IConsolidadoNotas[];
    faltas_totales?: IFalta;
}

export interface IConsolidadoNotas {
    materia?: IMateria;
    faltas?: IFalta;
    nota_final?: number;
}

export interface ICreateUpdateConsolidado {
    info_consolidado?: IConsolidado;
    info_consolidados_estudiantes?: IConsolidadoEstudiante[];
}

interface IFalta {
    justificadas?: number;
    sin_justificar?: number;
}