export interface IAlmacenPeriodo {
    count?: number;
    rows?: IPeriodo[];
}

export interface IAnioLectivo {
    id?: number;
    descripcion?: string;
    anio_actual?: number;
    id_estado_anio_lectivo?: number;
    id_rango?: number;
    vigente?: boolean;

    estado_anio_lectivo?: IEstadoAnioLectivo;
    rango?: IRango;
    periodo?: IPeriodo[];
}

export interface IEstadoAnioLectivo {
    id?: number;
    descripcion?: string;
}

export interface IPeriodo {
    id?: number;
    numero?: number;
    fecha_inicio?: string;
    fecha_finalizacion?: string;
    descripcion?: string;
    id_anio_lectivo?: number;

    anio_lectivo?: IAnioLectivo;
}

export interface IRango {
    id?: number;
    descripcion?: string;
    nota_minima?: number;
    nota_maxima?: number;
}