import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AdminGuard } from '@core/guards/admin.guard';

// Components
import { PersonaComponent } from './persona/persona.component';
import { MatriculaComponent } from './matricula/matricula.component';
import { DocenteComponent } from './docente/docente.component';

const routes: Routes = [
	{
		path: '',
		component: PersonaComponent,
		canActivate: [AdminGuard]
	},
	{ 
		path: 'personas',
		component: PersonaComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'matriculas',
		component: MatriculaComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'docentes',
		component: DocenteComponent,
		canActivate: [AdminGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PersonalRoutingModule { }