import { IRol } from './rol.interface';
import { IUsuario } from './usuario.interface';

export interface IAlmacenPersona {
    count?: number;
    rows?: IPersona[];
}

export interface IPersona {
    id?: number;
    documento?: string;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    fecha_nacimiento?: string;
    numero_telefono?: string;
    numero_celular?: string;
    direccion?: string;
    id_rol?: number;
    id_tipo_documento?: number;
    id_municipio?: number;
    id_sexo?: number;
    index?: number;

    departamento?: IDepartamento;
    municipio?: IMunicipio;
    rol?: IRol;
    sexo?: ISexo;
    tipo_documento?: ITipoDocumento;
    usuario?: IUsuario;
}

export interface ITipoDocumento {
    id?: number;
    nombre?: string;
    descripcion?: string;
}

export interface ISexo {
    id?: number;
    nombre?: string;
    descripcion?: string;
}

export interface IMunicipio {
    id?: number;
    nombre?: string;
    descripcion?: string;
    id_departamento?: number;

    departamento?: IDepartamento;
}

export interface IDepartamento {
    id?: number;
    nombre?: string;
    descripcion?: string; 
}