import { IAnioLectivo, IPeriodo } from "./anio-lectivo.interface";
import { IMateria } from "./area.interface";
import { ICurso } from "./curso.interface";
import { IDirectorGrupo } from "./director-grupo.interface";
import { IDocente } from "./docente.interface";
import { IEstudiante } from "./estudiante.interface";

export interface IAlmacenBoletin {
    count?: number;
    rows?: IBoletin[];
}

export interface IBoletin {
    id?: number;
    observaciones?: string;
    rector?: string;
    coordinador?: string;
    id_curso?: number;
    id_anio_lectivo?: number;
    id_periodo?: number;
    id_director_grupo?: number;
    id_estudiante?: number;

    curso?: ICurso;
    anio_lectivo?: IAnioLectivo;
    periodo?: IPeriodo;
    director_grupo?: IDirectorGrupo;
    estudiante?: IEstudiante;
}

export interface IValoracionCualitativa {
    id?: number;
    nunca?: boolean;
    a_veces?: boolean;
    siempre?: boolean;
    id_valoracion_formativa?: number;
    id_boletin?: number;

    valoracion_formativa?: IValoracionFormativa;
    boletin?: IBoletin;
}

export interface IValoracionFormativa {
    id?: number;
    descripcion?: string;
    vigente?: boolean;
}

export interface IBoletinFinal {
    materia?: IMateria;
    faltas?: IFalta;
    nota_final?: number;
}

export interface IFalta {
    justificadas?: number;
    sin_justificar?: number;
}

export interface ICreateUpdateBoletin {
    info_boletin?: IBoletin;
    info_valoraciones_cualitativas?: IValoracionCualitativa[];
}

export interface IPrintBoletin {
    boletin?: IBoletin;
    docente?: IDocente;
    estudiante?: IEstudiante;
    headerBoletin?: IHeaderBoletin;
    notasFinales?: IBoletinFinal[];
    valoracionesCualitativas?: IValoracionCualitativa[];
}

export interface IHeaderBoletin {
    anio_lectivo?: string;
    sede?: string;
    titulo?: string;
}