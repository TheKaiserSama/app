export interface IInstitucion {
    id?: number;
    nombre?: string;
    descripcion?: string;
    mision?: string;
    vision?: string;
    himno?: string;
    lema?: string;

    sede?: ISede[];
}

export interface ISede {
    id?: number;
    nombre?: string;
    descripcion?: string;
    direccion?: string;
    telefono?: string;
    id_institucion?: number;

    institucion?: IInstitucion;
}