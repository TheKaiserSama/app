const Models = require('../../app-core/models/index');

exports.modelsActividad = [
    {
        model: Models.Logro,
        as: 'logro',
        required: true
    }
];

exports.modelsAnioLectivo = [
    {
        model: Models.EstadoAnioLectivo,
        as: 'estado_anio_lectivo',
        required: true
    },
    {
        model: Models.Rango,
        as: 'rango',
        required: true
    }
];

exports.modelsArea = [
    {
        model: Models.Materia,
        as: 'materia'
    }
];

exports.modelsBoletin = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true
    },
    {
        model: Models.DirectorGrupo,
        as: 'director_grupo',
        required: true,
        include: [
            {
                model: Models.Docente,
                as: 'docente',
                required: true,
                include: [
                    {
                        model: Models.Persona,
                        as: 'persona',
                        required: true
                    }
                ]
            }
        ]
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true,
        include: [
            {
                model: Models.Persona,
                as: 'persona',
                required: true
            }
        ]
    },
    {
        model: Models.Periodo,
        as: 'periodo',
        required: false
    }
];

exports.modelsConsolidado = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true
    },
    {
        model: Models.DirectorGrupo,
        as: 'director_grupo',
        required: true,
        include: [
            {
                model: Models.Docente,
                as: 'docente',
                required: true,
                include: [
                    {
                        model: Models.Persona,
                        as: 'persona',
                        required: true
                    }
                ]
            }
        ]
    },
    {
        model: Models.Periodo,
        as: 'periodo',
        required: false
    }
];

exports.modelsCurso = [
    {
        model: Models.Sede,
        as: 'sede',
        required: true
    },
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Jornada,
        as: 'jornada',
        required: true
    },
    {
        model: Models.Grado,
        as: 'grado',
        required: true
    },
    {
        model: Models.Grupo,
        as: 'grupo',
        required: true
    }
];

exports.modelsDirectorGrupo = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true,
        include: [
            {
                model: Models.Sede,
                as: 'sede',
                required: true
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            },
            {
                model: Models.Jornada,
                as: 'jornada',
                required: true
            },
            {
                model: Models.Grado,
                as: 'grado',
                required: true
            },
            {
                model: Models.Grupo,
                as: 'grupo',
                required: true
            }
        ]
    },
    {
        model: Models.Docente,
        as: 'docente',
        required: true,
        include: [
            {
                model: Models.Persona,
                as: 'persona',
                required: true
            }
        ]
    }
];

exports.modelsDocente = [
    {
        model: Models.EstadoDocente,
        as: 'estado_docente',
        required: true
    },
    {
        model: Models.Persona,
        as: 'persona',
        required: true,
        include: [
            {
                model: Models.Sexo,
                as: 'sexo',
                required: true
            },
            {
                model: Models.Rol,
                as: 'rol',
                required: true
            },
            {
                model: Models.TipoDocumento,
                as: 'tipo_documento',
                required: true
            },
            {
                model: Models.Municipio,
                as: 'municipio',
                required: true,
                include: [
                    {
                        model: Models.Departamento,
                        as: 'departamento',
                        required: true
                    }
                ]
            }
        ]
    }
];

exports.modelsEstudiante = [
    {
        model: Models.EstadoEstudiante,
        as: 'estado_estudiante',
        required: true
    },
    {
        model: Models.Persona,
        as: 'persona',
        required: true,
        include: [
            {
                model: Models.Sexo,
                as: 'sexo',
                required: true
            },
            {
                model: Models.Rol,
                as: 'rol',
                required: true
            },
            {
                model: Models.TipoDocumento,
                as: 'tipo_documento',
                required: true
            },
            {
                model: Models.Municipio,
                as: 'municipio',
                required: true,
                include: [
                    {
                        model: Models.Departamento,
                        as: 'departamento',
                        required: true
                    }
                ]
            }
        ]
    }
];

exports.modelsEstudianteActividad = [
    {
        model: Models.Actividad,
        as: 'actividad',
        required: true
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true
    }
];

exports.modelsGradoMateria = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Grado,
        as: 'grado',
        required: true
    },
    {
        model: Models.Materia,
        as: 'materia',
        required: true,
        include: [
            {
                model: Models.Area,
                as: 'area',
                required: true
            }
        ]
    }
];

exports.modelsInasistencia = [
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true,
        include: [
            {
                model: Models.Persona,
                as: 'persona',
                required: true
            }
        ]
    },
    {
        model: Models.PlanDocente,
        as: 'plan_docente',
        required: true,
        include: [
            {
                model: Models.Curso,
                as: 'curso',
                required: true,
                include: [
                    {
                        model: Models.Grado,
                        as: 'grado',
                        required: true
                    },
                    {
                        model: Models.Grupo,
                        as: 'grupo',
                        required: true
                    },
                    {
                        model: Models.Jornada,
                        as: 'jornada',
                        required: true
                    }
                ]
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            },
            {
                model: Models.Docente,
                as: 'docente',
                required: true,
                include: [
                    {
                        model: Models.Persona,
                        as: 'persona',
                        required: true
                    }
                ]
            },
            {
                model: Models.Materia,
                as: 'materia',
                required: true
            },
            {
                model: Models.Periodo,
                as: 'periodo',
                required: true
            },
            {
                model: Models.Sede,
                as: 'sede',
                required: true
            }
        ]
    }
];

exports.modelsLogro = [
    {
        model: Models.PlanDocente,
        as: 'plan_docente',
        required: true,
        include: [
            {
                model: Models.Materia,
                as: 'materia',
                required: true
            },
            {
                model: Models.Periodo,
                as: 'periodo',
                required: true
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            },
            {
                model: Models.Docente,
                as: 'docente',
                required: true,
                include: [
                    {
                        model: Models.Persona,
                        as: 'persona',
                        required: true
                    }
                ]
            },
            {
                model: Models.Curso,
                as: 'curso',
                required: true,
                include: [
                    {
                        model: Models.Grado,
                        as: 'grado',
                        required: true
                    },
                    {
                        model: Models.Grupo,
                        as: 'grupo',
                        required: true
                    }
                ]
            }
        ]
    }
];

exports.modelsMateria = [
    {
        model: Models.Area,
        as: 'area',
        required: true
    }
];

exports.modelsMatricula = [
    {
        model: Models.EstadoMatricula,
        as: 'estado_matricula',
        required: true
    },
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true,
        include: [
            {
                model: Models.EstadoEstudiante,
                as: 'estado_estudiante',
                required: true
            },
            {
                model: Models.Persona,
                as: 'persona',
                required: true,
                include: [
                    {
                        model: Models.Municipio,
                        as: 'municipio',
                        required: true,
                        include: [
                            {
                                model: Models.Departamento,
                                as: 'departamento',
                                required: true
                            }
                        ]
                    },
                    {
                        model: Models.Sexo,
                        as: 'sexo',
                        required: true
                    },
                    {
                        model: Models.Rol,
                        as: 'rol',
                        required: true
                    },
                    {
                        model: Models.TipoDocumento,
                        as: 'tipo_documento',
                        required: true
                    }
                ]
            }
        ]
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true,
        include: [
            {
                model: Models.Jornada,
                as: 'jornada',
                required: true
            },
            {
                model: Models.Sede,
                as: 'sede',
                required: true
            },
            {
                model: Models.Grado,
                as: 'grado',
                required: true
            },
            {
                model: Models.Grupo,
                as: 'grupo',
                required: true
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            }
        ]
    }
];

exports.modelsNotificacion = [
    {
        model: Models.TipoNotificacion,
        as: 'tipo_notificacion',
        required: true
    },
    {
        model: Models.Actividad,
        as: 'actividad',
        required: false
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true,
        include: [
            {
                model: Models.EstadoEstudiante,
                as: 'estado_estudiante',
                required: true
            },
            {
                model: Models.Persona,
                as: 'persona',
                required: true
            }
        ]
    },
    {
        model: Models.PlanDocente,
        as: 'plan_docente',
        required: true,
        include: [
            {
                model: Models.Curso,
                as: 'curso',
                required: true,
                include: [
                    {
                        model: Models.Grado,
                        as: 'grado',
                        required: true
                    },
                    {
                        model: Models.Grupo,
                        as: 'grupo',
                        required: true
                    },
                    {
                        model: Models.Jornada,
                        as: 'jornada',
                        required: true
                    }
                ]
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            },
            {
                model: Models.Docente,
                as: 'docente',
                required: true,
                include: [
                    {
                        model: Models.Persona,
                        as: 'persona',
                        required: true
                    }
                ]
            },
            {
                model: Models.Materia,
                as: 'materia',
                required: true
            },
            {
                model: Models.Periodo,
                as: 'periodo',
                required: true
            },
            {
                model: Models.Sede,
                as: 'sede',
                required: true
            }
        ]
    }
];

exports.modelsPeriodo = [
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo',
        required: true
    }
];

exports.modelsPersona = [
    {
        model: Models.Sexo,
        as: 'sexo',
        required: true
    },
    {
        model: Models.Rol,
        as: 'rol',
        required: true
    },
    {
        model: Models.TipoDocumento,
        as: 'tipo_documento',
        required: true
    },
    {
        model: Models.Municipio,
        as: 'municipio',
        required: true,
        include: [
            {
                model: Models.Departamento,
                as: 'departamento',
                required: true
            }
        ]
    }
];

exports.modelsPlanDocente = [
    {
        model: Models.Periodo,
        as: 'periodo',
        required: true
    },
    {
        model: Models.AnioLectivo,
        as: 'anio_lectivo'
    },
    {
        model: Models.Sede,
        as: 'sede',
        required: true
    },
    {
        model: Models.Docente,
        as: 'docente',
        required: true
    },
    {
        model: Models.Materia,
        as: 'materia',
        required: true,
        include: [
            {
                model: Models.Area,
                as: 'area',
                required: true
            }
        ]
    },
    {
        model: Models.Curso,
        as: 'curso',
        required: true,
        include: [
            {
                model: Models.Grado,
                as: 'grado',
                required: true
            },
            {
                model: Models.Grupo,
                as: 'grupo',
                required: true
            },
            {
                model: Models.Jornada,
                as: 'jornada',
                required: true
            },
            {
                model: Models.AnioLectivo,
                as: 'anio_lectivo',
                required: true
            }
        ]
    }
];

exports.modelsPlanEstudiante = [
    {
        model: Models.PlanDocente,
        as: 'plan_docente',
        required: true,
        include: [
            {
                model: Models.Materia,
                as: 'materia',
                required: true
            }
        ]
    },
    {
        model: Models.Estudiante,
        as: 'estudiante',
        required: true
    }
];

exports.modelsSede = [
    {
        model: Models.Institucion,
        as: 'institucion',
        required: true
    }
];

exports.modelsUsuario = [
    {
        model: Models.Persona,
        as: 'persona',
        required: true
    },
    {
        model: Models.Rol,
        as: 'rol',
        require: true
    }
];

exports.modelsValoracionCualitativa = [
    {
        model: Models.ValoracionFormativa,
        as: 'valoracion_formativa',
        required: true
    },
    {
        model: Models.Boletin,
        as: 'boletin',
        required: true
    }
];