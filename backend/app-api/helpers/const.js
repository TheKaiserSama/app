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
    },
};

const ALL_ROL = [
    ROL.ADMINISTRADOR.id,
    ROL.DOCENTE.id,
    ROL.ESTUDIANTE.id,
    ROL.OTRO.id
];

const ALL_GRADO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const ALL_GRUPO = ['1', '2', '3'];
const ALL_PERIODO = [1, 2, 3, 4];

const ESTADO_ESTUDIANTE = {
    REGULAR: {
        id: 1,
        descripcion: 'Regular'
    },
    INCAPACIDAD: {
        id: 2,
        descripcion: 'Incapacidad'
    },
    SUSPENCION: {
        id: 3,
        descripcion: 'Suspencion'
    }
};

const ESTADO_MATRICULA = {
    ACTIVO: {
        id: 1,
        descripcion: 'Activo'
    },
    INACTIVO: {
        id: 2,
        descripcion: 'Inactivo'
    }
};

module.exports = {
    ROL,
    ALL_ROL,
    ALL_GRADO,
    ALL_GRUPO,
    ALL_PERIODO,
    ESTADO_ESTUDIANTE,
    ESTADO_MATRICULA
};