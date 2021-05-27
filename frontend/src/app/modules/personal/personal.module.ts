import { NgModule } from '@angular/core';

// Modules : Routing - Shared
import { PersonalRoutingModule } from './personal-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { PersonaComponent } from './persona/persona.component';
import { ListarPersonasComponent } from './persona/listar-personas/listar-personas.component';
import { MatriculaComponent } from './matricula/matricula.component';
import { ListarMatriculaComponent } from './matricula/listar-matricula/listar-matricula.component';
import { InfoEstudianteComponent } from './matricula/info-estudiante/info-estudiante.component';
import { InfoAcudienteComponent } from './matricula/info-acudiente/info-acudiente.component';
import { InfoMatriculaComponent } from './matricula/info-matricula/info-matricula.component';
import { FormPersonaComponent } from './shared/components/form-persona/form-persona.component';
import { SearchPersonaComponent } from './shared/components/search-persona/search-persona.component';
import { FormMatriculaComponent } from './shared/components/form-matricula/form-matricula.component';
import { CrearMatriculaComponent } from './matricula/crear-matricula.component';
import { EditarMatriculaComponent } from './matricula/editar-matricula.component';
import { DocenteComponent } from './docente/docente.component';
import { ListarDocenteComponent } from './docente/listar-docente/listar-docente.component';
import { FormDocenteComponent } from './shared/components/form-docente/form-docente.component';
import { InfoPersonalDocenteComponent } from './docente/info-personal-docente/info-personal-docente.component';
import { InfoAcademicaDocenteComponent } from './docente/info-academica-docente/info-academica-docente.component';
import { CrearDocenteComponent } from './docente/crear-docente.component';
import { EditarDocenteComponent } from './docente/editar-docente.component';
import { CargaAcademicaDocenteComponent } from './docente/carga-academica-docente/carga-academica-docente.component';
import { FormCargaAcademicaDocenteComponent } from './shared/components/form-carga-academica-docente/form-carga-academica-docente.component';
import { InfoPersonaComponent } from './persona/info-persona/info-persona.component';
import { FormGestionUsuarioComponent } from './persona/form-gestion-usuario/form-gestion-usuario.component';
import { CrearUsuarioComponent } from './persona/crear-usuario.component';
import { EditarUsuarioComponent } from './persona/editar-usuario.component';
import { ListarPlanDocenteAdminComponent } from './docente/listar-plan-docente-admin/listar-plan-docente-admin.component';

@NgModule({
	declarations: [
		PersonaComponent,
		ListarPersonasComponent,
		FormPersonaComponent,
		MatriculaComponent,
		ListarMatriculaComponent,
		InfoEstudianteComponent,
		SearchPersonaComponent,
		InfoAcudienteComponent,
		InfoMatriculaComponent,
		FormMatriculaComponent,
		CrearMatriculaComponent,
		EditarMatriculaComponent,
		DocenteComponent,
		ListarDocenteComponent,
		FormDocenteComponent,
		InfoPersonalDocenteComponent,
		InfoAcademicaDocenteComponent,
		CrearDocenteComponent,
		EditarDocenteComponent,
		CargaAcademicaDocenteComponent,
		FormCargaAcademicaDocenteComponent,
		InfoPersonaComponent,
		FormGestionUsuarioComponent,
		CrearUsuarioComponent,
		EditarUsuarioComponent,
		ListarPlanDocenteAdminComponent
	],
	imports: [
		PersonalRoutingModule,
		SharedModule
	]
})
export class PersonalModule { }