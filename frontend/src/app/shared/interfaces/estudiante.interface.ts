import { IPersona } from './persona.interface';

export interface IEstudiante {
    id?: number;
    fecha_registro?: string;
    fecha_ingreso?: string;
    vigente?: boolean;
    codigo?: string;
    id_estado_estudiante?: number;
    id_persona?: number;
    id_acudiente?: number;
    nota?: any;

    persona?: IPersona;
    estado_estudiante?: IEstadoEstudiante;
}

export interface IEstadoEstudiante {
    id?: number;
    descripcion?: string;
}