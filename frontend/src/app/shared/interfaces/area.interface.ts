export interface IAlmacenArea {
    count?: number;
    rows?: IArea[];
}

export interface IArea {
    id?: number;
    index?: number;
    nombre?: string;
    descripcion?: string;

    materia?: IMateria[];
}

export interface IAlmacenMateria {
    count?: number;
    rows?: IMateria[];
}

export interface IMateria {
    id?: number;
    index?: number;
    nombre?: string;
    descripcion?: string;
    vigente?: boolean;
    id_area?: number;

    area?: IArea;
}