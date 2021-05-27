import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { InasistenciaComponent } from './inasistencia/inasistencia.component';

const routes: Routes = [
	{
		path: '',
		component: InasistenciaComponent
	},
	{
		path: 'inasistencias',
		component: InasistenciaComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class InasistenciaRoutingModule { }