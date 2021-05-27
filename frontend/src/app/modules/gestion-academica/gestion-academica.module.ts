import { NgModule } from '@angular/core';

// Modules : Routing - Shared
import { GestionAcademicaRoutingModule } from './gestion-academica-routing.module';
import { SharedModule } from "../shared/shared.module";

// Components
import { LogrosComponent } from './logros/logros.component';
import { NotasComponent } from './notas/notas.component';
import { ListarLogrosComponent } from './logros/listar-logros/listar-logros.component';
import { ModalLogrosComponent } from './logros/modal-logros/modal-logros.component';
import { InfoProvisionalLogrosComponent } from './logros/info-provisional-logros/info-provisional-logros.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { InfoProvisionalActividadesComponent } from './actividades/info-provisional-actividades/info-provisional-actividades.component';
import { ListarActividadesComponent } from './actividades/listar-actividades/listar-actividades.component';
import { ModalActividadesComponent } from './actividades/modal-actividades/modal-actividades.component';
import { ModalElegirCursoComponent } from './notas/modal-elegir-curso/modal-elegir-curso.component';
import { ListarLogrosSimpleComponent } from './notas/listar-logros-simple/listar-logros-simple.component';
import { ListarActividadesSimpleComponent } from './notas/listar-actividades-simple/listar-actividades-simple.component';
import { ListarEstudiantesComponent } from './notas/listar-estudiantes/listar-estudiantes.component';
import { ListarResumenActividadesComponent } from './notas/listar-resumen-actividades/listar-resumen-actividades.component';
import { ListarResumenLogrosComponent } from './notas/listar-resumen-logros/listar-resumen-logros.component';
import { MateriasComponent } from './materias/materias.component';
import { ListarMateriasComponent } from './materias/listar-materias/listar-materias.component';
import { CrearMateriaComponent } from './materias/crear-materia.component';
import { EditarMateriaComponent } from './materias/editar-materia.component';
import { ListarAreasComponent } from './materias/listar-areas/listar-areas.component';
import { CursosComponent } from './cursos/cursos.component';
import { ListarGradosComponent } from './cursos/listar-grados/listar-grados.component';
import { ListarGruposComponent } from './cursos/listar-grupos/listar-grupos.component';
import { ListarCursosComponent } from './cursos/listar-cursos/listar-cursos.component';
import { CrearCursoComponent } from './cursos/crear-curso.component';
import { EditarCursoComponent } from './cursos/editar-curso.component';
import { NotasEstudianteComponent } from './notas-estudiante/notas-estudiante.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { ListarAniosLectivosComponent } from './periodos/listar-anios-lectivos/listar-anios-lectivos.component';
import { ListarPeriodosComponent } from './periodos/listar-periodos/listar-periodos.component';
import { CrearPeriodoComponent } from './periodos/crear-periodo.component';
import { EditarPeriodoComponent } from './periodos/editar-periodo.component';
import { ListarCursosMateriasComponent } from './cursos/listar-cursos-materias/listar-cursos-materias.component';
import { ModalCalificarComponent } from './notas/modal-calificar/modal-calificar.component';
import { ModalActividadesLogroComponent } from './notas-estudiante/modal-actividades-logro/modal-actividades-logro.component';
import { DirectoresGruposComponent } from './directores-grupos/directores-grupos.component';
import { AsignarDirectorGrupoComponent } from './directores-grupos/asignar-director-grupo/asignar-director-grupo.component';
import { ListarDocentesComponent } from './directores-grupos/listar-docentes/listar-docentes.component';
import { ListarDirectoresGrupoAdminComponent } from './directores-grupos/listar-directores-grupo-admin/listar-directores-grupo-admin.component';
import { CeldaLogroComponent } from './notas-estudiante/celda-logro/celda-logro.component';
import { ListarPlanesDocenteComponent } from './logros/listar-planes-docente/listar-planes-docente.component';
import { ListarLogrosDocenteComponent } from './logros/listar-logros-docente/listar-logros-docente.component';
import { LogrosActividadesComponent } from './actividades/logros-actividades/logros-actividades.component';

@NgModule({
	declarations: [
		LogrosComponent,
		NotasComponent,
		ListarLogrosComponent,
		ModalLogrosComponent,
		InfoProvisionalLogrosComponent,
		ActividadesComponent,
		InfoProvisionalActividadesComponent,
		ListarActividadesComponent,
		ModalActividadesComponent,
		ModalElegirCursoComponent,
		ListarLogrosSimpleComponent,
		ListarActividadesSimpleComponent,
		ListarEstudiantesComponent,
		ListarResumenActividadesComponent,
		ListarResumenLogrosComponent,
		MateriasComponent,
		ListarMateriasComponent,
		CrearMateriaComponent,
		EditarMateriaComponent,
		ListarAreasComponent,
		CursosComponent,
		ListarGradosComponent,
		ListarGruposComponent,
		ListarCursosComponent,
		CrearCursoComponent,
		EditarCursoComponent,
		NotasEstudianteComponent,
		PeriodosComponent,
		ListarAniosLectivosComponent,
		ListarPeriodosComponent,
		CrearPeriodoComponent,
		EditarPeriodoComponent,
		ListarCursosMateriasComponent,
		ModalCalificarComponent,
		ModalActividadesLogroComponent,
		DirectoresGruposComponent,
		AsignarDirectorGrupoComponent,
		ListarDocentesComponent,
		ListarDirectoresGrupoAdminComponent,
		CeldaLogroComponent,
		ListarPlanesDocenteComponent,
		ListarLogrosDocenteComponent,
		LogrosActividadesComponent,
	],
	imports: [
		SharedModule,
		GestionAcademicaRoutingModule
	]
})
export class GestionAcademicaModule { }