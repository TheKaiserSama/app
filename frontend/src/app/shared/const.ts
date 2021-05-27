import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const MAX_DATE: NgbDateStruct = { year: new Date().getFullYear() + 1, month: 1, day: 1 };
const MIN_DATE: NgbDateStruct = { year: 1930, month: 1, day: 1 };
const URL_SOCKECT: string = 'ws://localhost:3000';

const ROL = {
    ADMINISTRADOR: {
        id: 1,
        nombre: 'Administrador' 
    },
    DOCENTE: {
        id: 2,
        nombre: 'Docente'
    },
    ESTUDIANTE: {
        id: 3,
        nombre: 'Estudiante'
    },
    OTRO: {
        id: 4,
        nombre: 'Otro'
    }
};

const ALL_ROL = [
    ROL.ADMINISTRADOR.id,
    ROL.DOCENTE.id,
    ROL.ESTUDIANTE.id,
    ROL.OTRO.id
];

const VIGENTE = {
    YES: true,
    NO: false
};

const ALL_GRADO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const ALL_GRUPO = ['1', '2', '3'];
const ESTADO_ESTUDIANTE = {
    REGULAR: {
        id: 1,
        decripcion: 'Regular'
    },
    VACACIONES: {
        id: 2,
        decripcion: 'Vacaciones'
    },
    INCAPACIDAD: {
        id: 3,
        decripcion: 'Incapacidad'
    }
};

const ESTADO_DOCENTE = {
    REGULAR: {
        id: 1,
        decripcion: 'Regular'
    },
    SUSPENCION: {
        id: 2,
        decripcion: 'Suspensión'
    },
    INCAPACIDAD: {
        id: 3,
        decripcion: 'Incapacidad'
    }
};

const ESTADO_MATRICULA = {
    ACIVO: {
        id: 1,
        decripcion: 'Activo'
    },
    INACIVO: {
        id: 2,
        decripcion: 'Inactivo'
    }
};

const ALL_PERIODO = [1, 2, 3, 4];

const MENU_ADMINISTRADOR = [
    {
        titulo: 'Gestión Académica',
        icono: 'fa fa-book',
        opciones: [
            { titulo: 'Periodos' },
            { titulo: 'Materias' },
            { titulo: 'Cursos' },
            { titulo: 'Directores de grupos' }
        ]
    },
    {
        titulo: 'Personal',
        icono: 'fa fa-users',
        opciones: [
            { titulo: 'Personas' },
            { titulo: 'Matriculas' },
            { titulo: 'Docentes' }
        ]
    },
    {
        titulo: 'Estadísticas',
        icono: 'fa fa-line-chart',
        opciones: [
            // { titulo: 'Gráficos' },
            { titulo: 'Reportes' }
        ]
    },
    // {
    //     titulo: 'Inasistencias',
    //     icono: 'fa fa-list',
    //     opciones: [
    //         { titulo: 'Inasistencias' }
    //     ]
    // },
    {
        titulo: 'Configuración',
        icono: 'fa fa-cog',
        opciones: [
            // { titulo: 'Rol' },
            // { titulo: 'Usuario' },
            { titulo: 'Institución' }
        ]
    }
];

const MENU_DOCENTE = [
    {
        titulo: 'Gestión Académica',
        icono: 'fa fa-book',
        opciones: [
            { titulo: 'Logros' },
            { titulo: 'Actividades' },
            { titulo: 'Notas' },
        ]
    },
    {
        titulo: 'Estadísticas',
        icono: 'fa fa-line-chart',
        opciones: [
            // { titulo: 'Gráficos' },
            { titulo: 'Reportes' }
        ]
    },
    {
        titulo: 'Notificaciones',
        icono: 'fa fa-bell',
        opciones: [
            { titulo: 'Notificaciones' }
        ]
    },
    {
        titulo: 'Inasistencias',
        icono: 'fa fa-list',
        opciones: [
            { titulo: 'Inasistencias' }
        ]
    },
    // {
    //     titulo: 'Configuración',
    //     icono: 'fa fa-cog',
    //     opciones: [
    //         { titulo: 'Rol' },
    //         { titulo: 'Usuario' }
    //     ]
    // }
];

const MENU_ESTUDIANTE = [
    {
        titulo: 'Gestión Académica',
        icono: 'fa fa-book',
        opciones: [
            { titulo: 'Notas' },
        ]
    },
    // {
    //     titulo: 'Estadísticas',
    //     icono: 'fa fa-line-chart',
    //     opciones: [
    //         { titulo: 'Gráficos' },
    //         // { titulo: 'Reportes' }
    //     ]
    // },
    {
        titulo: 'Notificaciones',
        icono: 'fa fa-bell',
        opciones: [
            { titulo: 'Notificaciones' }
        ]
    },
    {
        titulo: 'Inasistencias',
        icono: 'fa fa-list',
        opciones: [
            { titulo: 'Inasistencias' }
        ]
    },
    // {
    //     titulo: 'Configuración',
    //     icono: 'fa fa-cog',
    //     opciones: [
    //         { titulo: 'Rol' },
    //         { titulo: 'Usuario' }
    //     ]
    // }
];

const REPORTES_DOCENTE: any[] = [];
const REPORTES_DIRECTOR_GRUPO: any[] = [
    { id: 1, nombre: 'Boletínes' },
    { id: 2, nombre: 'Consolidados' },
    // { id: 3, nombre: 'Planillas' },
];
const REPORTES_ADMINISTRADOR: any[] = [
    { id: 1, nombre: 'Boletínes' },
    { id: 2, nombre: 'Consolidados' },
    // { id: 3, nombre: 'Planillas' },
];

const TIPOS_REPORTES = {
    BOLETINES: { id: 1, nombre: 'boletínes' },
    CONSOLIDADOS: { id: 2, nombre: 'consolidados' },
    // PLANILLAS: { id: 3, nombre: 'planillas' },
};

export {
    MIN_DATE,
    MAX_DATE,
    URL_SOCKECT,
    VIGENTE,
    ROL,
    ALL_GRADO,
    ALL_GRUPO,
    ALL_ROL,
    ALL_PERIODO,
    ESTADO_ESTUDIANTE,
    ESTADO_MATRICULA,
    ESTADO_DOCENTE,
    MENU_ADMINISTRADOR,
    MENU_DOCENTE,
    MENU_ESTUDIANTE,
    TIPOS_REPORTES,
    REPORTES_ADMINISTRADOR,
    REPORTES_DOCENTE,
    REPORTES_DIRECTOR_GRUPO
};