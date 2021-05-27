import { NgModule } from '@angular/core';

// Modules : Routing - Shared
import { InasistenciaRoutingModule } from './inasistencia-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { InasistenciaComponent } from './inasistencia/inasistencia.component';
import { InasistenciaAdministradorComponent } from './inasistencia/inasistencia-administrador/inasistencia-administrador.component';
import { InasistenciaDocenteComponent } from './inasistencia/inasistencia-docente/inasistencia-docente.component';
import { InasistenciaEstudianteComponent } from './inasistencia/inasistencia-estudiante/inasistencia-estudiante.component';
import { RegistrarInasistenciaComponent } from './registrar-inasistencia/registrar-inasistencia.component';
import { CursosDocenteComponent } from './cursos-docente/cursos-docente.component';

@NgModule({
	declarations: [
		InasistenciaComponent,
		InasistenciaEstudianteComponent,
		InasistenciaDocenteComponent,
		RegistrarInasistenciaComponent,
		CursosDocenteComponent,
		InasistenciaAdministradorComponent
	],
	imports: [
		InasistenciaRoutingModule,
		SharedModule
	]
})
export class InasistenciaModule { }