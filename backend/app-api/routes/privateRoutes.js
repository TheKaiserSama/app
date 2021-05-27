const express = require('express');
const router = express.Router();

const Controllers = require('../controllers/index');

router.get('/actividades/logro', Controllers.ActividadController.getActividadesPorLogro);
router.get('/actividades/logro/:id_logro', Controllers.ActividadController.getActividadPorLogro);
router.get('/actividades/:id', Controllers.ActividadController.getByPkActividad);
router.post('/actividades', Controllers.ActividadController.bulkCreateActividad);
router.put('/actividades', Controllers.ActividadController.updateActividad);
router.delete('/actividades', Controllers.ActividadController.destroyActividades);
router.delete('/actividades/logro/:id', Controllers.ActividadController.destroyActividadPorLogro);

router.get('/anios-lectivos', Controllers.AnioLectivoController.getAllAniosLectivos);
router.get('/anios-lectivos/:id', Controllers.AnioLectivoController.getByPkAnioLectivo);
router.get('/anios-lectivos/anio/:anio', Controllers.AnioLectivoController.getAnioLectivoPorNumero);
router.post('/anios-lectivos', Controllers.AnioLectivoController.findOrCreateAnioLectivo);
router.put('/anios-lectivos/:id', Controllers.AnioLectivoController.updateAnioLectivo);
router.delete('/anios-lectivos/:id', Controllers.AnioLectivoController.destroyAnioLectivo);

router.get('/areas', Controllers.AreaController.getAllAreas);
router.get('/areas/paginate', Controllers.AreaController.getAllAreasPaginacion);
router.get('/areas/:id', Controllers.AreaController.getByPkArea);
router.get('/areas/:id/materias', Controllers.MateriaController.getMateriasByPkArea);
router.post('/areas', Controllers.AreaController.findOrCreateArea);
router.put('/areas/:id', Controllers.AreaController.updateArea);
router.delete('/areas/:id', Controllers.AreaController.destroyArea);

// router.get('/boletines', Controllers.BoletinController.)
router.get('/boletines/valoraciones-formativas', Controllers.BoletinController.getValoracionesFormativas);
router.get('/boletines/notas-finales/:id_estudiante', Controllers.BoletinController.getNotasBoletinFinal);
router.get('/boletines/notas-por-periodo/:id_estudiante', Controllers.BoletinController.getNotasBoletinPorPeriodo);
router.get('/boletines/boletines-por-periodo', Controllers.BoletinController.getBoletinesPorPeriodo);
router.get('/boletines/imprimir-uno/:id_estudiante', Controllers.BoletinController.printOneBoletin);
router.get('/boletines/imprimir-todos', Controllers.BoletinController.printAllBoletin);
router.post('/boletines', Controllers.BoletinController.createBoletin);
router.put('/boletines/:id_boletin', Controllers.BoletinController.updateBoletin);
router.delete('/boletines/:id_boletin', Controllers.BoletinController.deleteBoletin);

router.get('/consolidados/consolidado-por-periodo', Controllers.ConsolidadoController.getConsolidadoPorPeriodo);
router.get('/consolidados/consolidado-final', Controllers.ConsolidadoController.getConsolidadoFinal);
router.post('/consolidados', Controllers.ConsolidadoController.createConsolidado);
router.put('/consolidados/:id_consolidado', Controllers.ConsolidadoController.updateConsolidado);

router.get('/cursos', Controllers.CursoController.getAllCursos);
router.get('/cursos/:id', Controllers.CursoController.getByPkCurso);
router.get('/cursos/:id_sede/:id_anio_lectivo', Controllers.CursoController.getCursoPorSede);
router.get('/cursos-por-sede/:id_sede/:id_anio_lectivo', Controllers.CursoController.getCursoPorSedeAnioLectivo);
router.post('/cursos', Controllers.CursoController.findOrCreateCurso);
router.put('/cursos/:id', Controllers.CursoController.updateCurso);
router.delete('/cursos/:id', Controllers.CursoController.destroyCurso);

router.get('/departamentos', Controllers.DepartamentoController.getAllDepartamentos);
router.get('/departamentos/:id', Controllers.DepartamentoController.getByPkDepartamento);

router.get('/directores-grupo', Controllers.DirectorGrupoController.getAllDirectoresGrupo);
router.get('/directores-grupo/:id', Controllers.DirectorGrupoController.getByPkDirectorGrupo);
router.get('/directores-grupo/:id_anio_lectivo/directores-cursos', Controllers.DirectorGrupoController.getDirectoresPorAnioLectivo);
router.get('/directores-grupo/:id_docente/cursos-asignados', Controllers.DirectorGrupoController.getCursosAsignadosADirector);
router.post('/directores-grupo', Controllers.DirectorGrupoController.createDirectorGrupo);
router.delete('/directores-grupo/:id', Controllers.DirectorGrupoController.destroyDirectorGrupo);

router.get('/docentes', Controllers.DocenteController.getAllDocentes);
router.get('/docentes/count', Controllers.DocenteController.getCountDocentes);
router.get('/docentes/no-directores-grupo', Controllers.DocenteController.getDocentesNoDirectoresGrupo);
router.get('/docentes/:id', Controllers.DocenteController.getByPkDocente);
router.get('/docentes/:codigo/codigo', Controllers.DocenteController.getDocentePorCodigo);
router.get('/docentes/:id_persona/persona', Controllers.DocenteController.getDocenteByPkPersona);
router.post('/docentes', Controllers.DocenteController.createDocente);
router.put('/docentes/:id', Controllers.DocenteController.updateDocente);
router.delete('/docentes/:id', Controllers.DocenteController.destroyDocente);

router.get('/estados-anios-lectivos', Controllers.EstadoAnioLectivoController.getAllEstadosAniosLectivos);
router.get('/estados-anios-lectivos/:id', Controllers.EstadoAnioLectivoController.getByPkEstadoAnioLectivo);

router.get('/estados-docentes', Controllers.EstadoDocenteController.getAllEstadosDocente);
router.get('/estados-docentes/:id', Controllers.EstadoDocenteController.getByPkEstadoDocente);

router.get('/estados-estudiantes', Controllers.EstadoEstudianteController.getAllEstadosEstudiante);
router.get('/estados-estudiantes/:id', Controllers.EstadoEstudianteController.getByPkEstadoEstudiante);

router.get('/estados-matriculas', Controllers.EstadoMatriculaController.getAllEstadosMatricula);
router.get('/estados-matriculas/:id', Controllers.EstadoMatriculaController.getByPkEstadoMatricula);

router.get('/estudiantes/count', Controllers.EstudianteController.getCountEstudiantes);
router.get('/estudiantes/documento/:documento', Controllers.EstudianteController.getEstudiantePorNumeroDocumento);
router.get('/estudiantes/persona/:id_persona', Controllers.EstudianteController.getEstudianteByPkPersona);
router.put('/estudiantes/:id', Controllers.EstudianteController.updateEstudiante);

router.get('/grados', Controllers.GradoController.getAllGrados);
router.get('/grados/anio/:anio', Controllers.GradoController.getGradosPorAnio);
router.get('/grados/descripcion/:descripcion', Controllers.GradoController.getGradoPorDescripcion);
router.get('/grados/:id', Controllers.GradoController.getByPkGrado);
router.get('/grados/:id_sede/:id_grado/:id_anio_lectivo/grupos', Controllers.CursoController.getGrupoPorGrado); // =
router.post('/grados', Controllers.GradoController.findOrCreateGrado);
router.put('/grados/:id', Controllers.GradoController.updateGrado);
router.delete('/grados/:id', Controllers.GradoController.destroyGrado);

router.get('/grados-materias', Controllers.GradoMateriaController.getAllGradosMaterias);
router.get('/grados-materias/:id', Controllers.GradoMateriaController.getByPkGradoMateria);
router.get('/grados-materias/:id_anio_lectivo/:id_grado', Controllers.GradoMateriaController.getGradoMateriaParams);
router.post('/grados-materias', Controllers.GradoMateriaController.findOrCreateGradoMateria);
router.put('/grados-materias/:id', Controllers.GradoMateriaController.updateGradoMateria);
router.delete('/grados-materias/:id', Controllers.GradoMateriaController.destroyGradoMateria);

router.get('/grupos', Controllers.GrupoController.getAllGrupos);
router.get('/grupos/:id', Controllers.GrupoController.getByPkGrupo);
router.get('/grupos/descripcion/:descripcion', Controllers.GrupoController.getGrupoPorDescripcion);
router.post('/grupos', Controllers.GrupoController.findOrCreateGrupo);
router.put('/grupos/:id', Controllers.GrupoController.updateGrupo);
router.delete('/grupos/:id', Controllers.GrupoController.destroyGrupo);

router.get('/inasistencias', Controllers.InasistenciaController.findInasistenciaByParams);
router.get('/inasistencias/:id', Controllers.InasistenciaController.getByPkInasistencia);
router.get('/inasistencias/:id/administrador', Controllers.InasistenciaController.getAllInasistenciasAdministrador);
router.get('/inasistencias/:id/docente', Controllers.InasistenciaController.getAllInasistenciasDocente);
router.get('/inasistencias/:id/estudiante', Controllers.InasistenciaController.getAllInasistenciasEstudiante);
router.post('/inasistencias', Controllers.InasistenciaController.createInasistencia);
router.post('/inasistencias-coleccion', Controllers.InasistenciaController.findOrCreateInasistencia);
router.put('/inasistencias/:id', Controllers.InasistenciaController.updateInasistencia);
router.delete('/inasistencias/:id', Controllers.InasistenciaController.destroyInasistencia);

router.get('/institucion', Controllers.InstitucionController.getAllInstituciones);
router.get('/institucion/:id', Controllers.InstitucionController.getByPkInstitucion);
router.post('/institucion', Controllers.InstitucionController.createInstitucion);
router.put('/institucion/:id', Controllers.InstitucionController.updateInstitucion);

router.get('/jornadas', Controllers.JornadaController.getAllJornadas);
router.get('/jornadas/:id', Controllers.JornadaController.getByPkJornada);

router.get('/logros', Controllers.LogroController.getAllLogros);
router.get('/logros/:id', Controllers.LogroController.getByPkLogro);
// router.get('/logro/actividad/:id_logro', Controllers.LogroController.findLogroActividad);
router.get('/logros/:id_plan_docente/plan-docente', Controllers.LogroController.getLogrosByPkPlanDocente);
router.get('/logros/:id_logro/notas-actividades', Controllers.LogroController.getNotasActividadesPorLogro);
router.get('/logros/:id_plan_docente/notas-logros', Controllers.LogroController.getNotasPorLogros);
router.post('/logros', Controllers.LogroController.bulkCreateLogro);
router.put('/logros', Controllers.LogroController.updateLogro);
router.delete('/logros', Controllers.LogroController.destroyLogro);
router.delete('/logros/:id_plan_docente/plan-docente', Controllers.LogroController.destroyLogroByPkPlanDocente);

router.get('/materias', Controllers.MateriaController.getAllMaterias);
router.get('/materias/:id', Controllers.MateriaController.getByPkMateria);
router.post('/materias', Controllers.MateriaController.findOrCreateMateria);
router.put('/materias/:id', Controllers.MateriaController.updateMateria);
router.delete('/materias/:id', Controllers.MateriaController.destroyMateria);

router.get('/matriculas', Controllers.MatriculaController.getAllMatriculas);
router.get('/matriculas/count-matriculas-por-sede', Controllers.MatriculaController.getCountMatriculasPorSede);
router.get('/matriculas/count-matriculas-ultimos-anios', Controllers.MatriculaController.getCountMatriculasUltimosAnios);
router.get('/matriculas/:documento/estudiante-matriculado', Controllers.MatriculaController.isMatriculado);
router.get('/matriculas/:id', Controllers.MatriculaController.getByPkMatricula);
router.get('/matriculas/:id_estudiante/estudiante', Controllers.MatriculaController.getMatriculasPorEstudiante);
router.get('/matriculas/curso/:id_curso', Controllers.MatriculaController.getMatriculasPorCurso);
router.post('/matriculas', Controllers.MatriculaController.createMatricula);
router.put('/matriculas', Controllers.MatriculaController.updateMatricula);
router.delete('/matriculas/:id', Controllers.MatriculaController.destroyMatricula);

router.get('/municipios/:id', Controllers.MunicipioController.getByPkMunicipio);
router.get('/municipios/departamento/:id', Controllers.MunicipioController.getMunicipiosPorDepartamento);

router.get('/notas-actividades/maxima', Controllers.EstudianteActividadController.getNotasMasAltas);
router.get('/notas-actividades/minima', Controllers.EstudianteActividadController.getNotasMasBajas);
router.get('/notas-actividades/promedio', Controllers.EstudianteActividadController.getNotaPromedio);
router.get('/notas-actividades/:id_estudiante/:id_actividad', Controllers.EstudianteActividadController.getOneEstudianteActividad);
router.post('/notas-actividades', Controllers.EstudianteActividadController.findOrCreateEstudianteActividad);

router.post('/notas-logros', Controllers.EstudianteLogroController.createEstudianteLogro);

router.get('/notificaciones/:id', Controllers.NotificacionController.getByPkNotificacion);
router.get('/notificaciones/:id_estudiante/estudiante', Controllers.NotificacionController.getAllNotificacionesByPkEstudiante);
router.get('/notificaciones/:id_docente/docente', Controllers.NotificacionController.getAllNotificacionesByPkDocente);
router.get('/notificaciones/:id_estudiante/ultimas_notificaciones', Controllers.NotificacionController.getUltimasNotificaciones);
router.post('/notificaciones', Controllers.NotificacionController.createNotificacion);
router.put('/notificaciones/:id', Controllers.NotificacionController.updateNotificacion);
router.delete('/notificaciones/:id', Controllers.NotificacionController.destroyNotificacion);

router.get('/periodos', Controllers.PeriodoController.getAllPeriodos);
router.get('/periodos/:id', Controllers.PeriodoController.getByPkPeriodo);
router.get('/periodos/anio_lectivo/:id_anio_lectivo', Controllers.PeriodoController.getPeriodosPorAnioLectivo);
router.post('/periodos', Controllers.PeriodoController.findOrCreatePeriodo);
router.put('/periodos/:id', Controllers.PeriodoController.updatePeriodo);
router.delete('/periodos/:id', Controllers.PeriodoController.destroyPeriodo);

router.get('/personas', Controllers.PersonaController.getAllPersonas);
router.get('/personas/:id', Controllers.PersonaController.getByPkPersona);
router.get('/personas/:documento/acudiente', Controllers.PersonaController.getPersonaAcudiente);
router.get('/personas/:documento/documento', Controllers.PersonaController.getPersonaPorNumeroDocumento);
router.post('/personas', Controllers.PersonaController.findOrCreatePersona);
router.put('/personas/:id', Controllers.PersonaController.updatePersona);
router.delete('/personas/:id', Controllers.PersonaController.destroyPersona);

router.get('/planes-docentes', Controllers.PlanDocenteController.getAllPlanesDocente);
router.get('/plan-docente/:id', Controllers.PlanDocenteController.getByPkPlanDocente);
router.get('/planes-docentes/curso/:id_curso', Controllers.PlanDocenteController.getPlanDocentePorCurso);
router.get('/planes-docentes/:id_docente/cursos-docente', Controllers.PlanDocenteController.getCursosPorDocente);
router.get('/planes-docentes/:id_docente/materias-docente', Controllers.PlanDocenteController.getMateriasDocente);
router.get('/planes-docentes/parametros-opcionales', Controllers.PlanDocenteController.getCursosPorPeriodo);
router.post('/planes-docentes', Controllers.PlanDocenteController.findOrCreatePlanDocente);
router.put('/planes-docentes/:id', Controllers.PlanDocenteController.updatePlanDocente);
router.delete('/planes-docentes/:id', Controllers.PlanDocenteController.destroyPlanDocente);

router.get('/planes-estudiantes/:id_estudiante', Controllers.PlanEstudianteController.getPlanEstudiantePorEstudiante);

router.get('/rangos', Controllers.RangoController.getAllRangos);
router.get('/rangos/:id', Controllers.RangoController.getByPkRango);
router.post('/rangos', Controllers.RangoController.createRango);
router.put('/rangos/:id', Controllers.RangoController.updateRango);
router.delete('/rangos/:id', Controllers.RangoController.destroyRango);

router.get('/roles', Controllers.RolController.getAllRoles);
router.get('/roles/:id', Controllers.RolController.getByPkRol);

router.get('/sedes', Controllers.SedeController.getAllSedes);
router.get('/sedes/count', Controllers.SedeController.getCountSedes);
router.get('/sedes/:id', Controllers.SedeController.getByPkSede);
router.post('/sedes', Controllers.SedeController.findOrCreateSede);
router.put('/sedes/:id', Controllers.SedeController.updateSede);
router.delete('/sedes/:id', Controllers.SedeController.destroySede);

router.get('/sexos', Controllers.SexoController.getAllSexos);
router.get('/sexos/:id', Controllers.SexoController.getByPkSexo);

router.get('/tipos-documentos', Controllers.TipoDocumentoController.getAllTiposDocumentos);
router.get('/tipos-documentos/:id', Controllers.TipoDocumentoController.getByPkTipoDocumento);

router.get('/usuarios', Controllers.UsuarioController.getAllUsuarios);
router.get('/usuarios/:id', Controllers.UsuarioController.getByPkUsuario);
router.post('/usuarios', Controllers.UsuarioController.createUsuario);
router.put('/usuarios/:id', Controllers.UsuarioController.updateUsuario);
router.delete('/usuarios/:id', Controllers.UsuarioController.destroyUsuario);

router.get('/valoraciones-formativas', Controllers.ValoracionFormativaController.getAllValoracionesFormativas);
router.post('/valoraciones-formativas', Controllers.ValoracionFormativaController.createValoracionFormativa);
router.put('/valoraciones-formativas/:id_valoracion_formativa', Controllers.ValoracionFormativaController.updateValoracionFormativa);
router.delete('/valoraciones-formativas/:id_valoracion_formativa', Controllers.ValoracionFormativaController.deleteValoracionFormativa);

module.exports = router;