import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AdminGuard } from '@core/guards/admin.guard';

// Components
import { InstitucionComponent } from './institucion/institucion.component';

const routes: Routes = [
	{
		path: '',
		component: InstitucionComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'institucion',
		component: InstitucionComponent,
		canActivate: [AdminGuard]
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }