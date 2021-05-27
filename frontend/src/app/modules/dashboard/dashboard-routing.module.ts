import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: '',
				component: WelcomeComponent
			},
			{
				path: 'personal',
				loadChildren: () => import('../../modules/personal/personal.module')
				.then(m => m.PersonalModule)
			},
			{
				path: 'gestion-academica',
				loadChildren: () => import('../../modules/gestion-academica/gestion-academica.module')
				.then(m => m.GestionAcademicaModule)
			},
			{
				path: 'estadisticas',
				loadChildren: () => import('../../modules/estadisticas/estadisticas.module')
				.then(m => m.EstadisticasModule)
			},
			{
				path: 'configuracion',
				loadChildren: () => import('../../modules/configuracion/configuracion.module')
				.then(m => m.ConfiguracionModule)
			},
			{
				path: 'notificaciones',
				loadChildren: () => import('../../modules/notificacion/notificacion.module')
				.then(m => m.NotificacionModule)
			},
			{
				path: 'inasistencias',
				loadChildren: () => import('../../modules/inasistencia/inasistencia.module')
				.then(m => m.InasistenciaModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DashboardRoutingModule { }