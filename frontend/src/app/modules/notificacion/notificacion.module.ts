import { NgModule } from '@angular/core';

// Modules : Routing - Shared
import { NotificacionRoutingModule } from './notificacion-routing.module';
import { SharedModule } from "../shared/shared.module";

// Components
import { NotificacionDocenteComponent } from './notificacion/notificacion-docente/notificacion-docente.component';
import { NotificacionEstudianteComponent } from './notificacion/notificacion-estudiante/notificacion-estudiante.component';
import { NotificacionComponent } from './notificacion/notificacion.component';

@NgModule({
	declarations: [
		NotificacionDocenteComponent,
		NotificacionEstudianteComponent,
		NotificacionComponent
	],
	imports: [
		NotificacionRoutingModule,
		SharedModule
	]
})
export class NotificacionModule { }