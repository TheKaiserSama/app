import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AdminOrDirectorGrupoGuard } from '@core/guards/admin-or-director-grupo.guard';

// Components
import { ReportesComponent } from './reportes/reportes.component';

const routes: Routes = [
	{
		path: '',
		component: ReportesComponent,
		canActivate: [AdminOrDirectorGrupoGuard]
	},
	{
		path: 'reportes',
		component: ReportesComponent,
		canActivate: [AdminOrDirectorGrupoGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EstadisticasRoutingModule { }