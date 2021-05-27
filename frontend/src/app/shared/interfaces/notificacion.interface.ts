import { IActividad } from './actividad.interface';
import { IEstudiante } from './estudiante.interface';
import { IPlanDocente } from './plan-docente.interface';

export interface IAlmacenNotificacion {
    count?: number;
    rows?: INotificacion[];
}

export interface INotificacion {
    id?: number;
    mensaje?: string;
    fecha?: string;
    vigente?: boolean;
    visto?: boolean;
    id_tipo_notificacion?: number;
    id_estudiante?: number;
    id_plan_docente?: number;
    id_actividad?: number;
    index?: number;

    tipo_notificacion?: ITipoNotificacion;
    estudiante?: IEstudiante;
    plan_docente?: IPlanDocente;
    actividad?: IActividad;
}

export interface ITipoNotificacion {
    id?: number;
    nombre?: string;
    descripcion?: string;
}