import { IMenu } from './menu.interface';
import { IRol } from './rol.interface';
import { IPersona } from './persona.interface';
import { IDocente } from './docente.interface';
import { IEstudiante } from './estudiante.interface';

export interface IUsuario {
    id?: number;
    username?: string;
    password?: string;
    ultima_sesion?: Date;
    fecha_creacion?: Date;
    id_rol?: number;
    id_persona?: number;
    expiresIn?: number;
    token?: string;

    rol?: IRol;
    persona?: IPersona;
    docente?: IDocente;
    estudiante?: IEstudiante;
    menu?: IMenu[];
}