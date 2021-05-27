import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { DocenteOrEstudianteGuard } from '@core/guards/docente-or-estudiante.guard';

// Components
import { NotificacionComponent } from './notificacion/notificacion.component';

const routes: Routes = [
	{
		path: '',
		component: NotificacionComponent,
		canActivate: [DocenteOrEstudianteGuard]
	},
	{
		path: 'notificaciones',
		component: NotificacionComponent,
		canActivate: [DocenteOrEstudianteGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class NotificacionRoutingModule { }