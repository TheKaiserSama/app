import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AdminGuard } from '@core/guards/admin.guard';
import { DocenteGuard } from '@core/guards/docente.guard';
import { DocenteOrEstudianteGuard } from '@core/guards/docente-or-estudiante.guard';

// Components
import { LogrosComponent } from './logros/logros.component';
import { NotasComponent } from './notas/notas.component';
import { ActividadesComponent } from './actividades/actividades.component';
import { MateriasComponent } from './materias/materias.component';
import { CursosComponent } from './cursos/cursos.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { DirectoresGruposComponent } from './directores-grupos/directores-grupos.component';

const routes: Routes = [
	{
		path: 'logros',
		component: LogrosComponent,
		canActivate: [DocenteGuard]
	},
	{
		path: 'actividades',
		component: ActividadesComponent,
		canActivate: [DocenteGuard]
	},
	{
		path: 'notas',
		component: NotasComponent,
		canActivate: [DocenteOrEstudianteGuard]
	},
	{
		path: 'materias',
		component: MateriasComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'cursos',
		component: CursosComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'periodos',
		component: PeriodosComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'directores-de-grupos',
		component: DirectoresGruposComponent,
		canActivate: [AdminGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class GestionAcademicaRoutingModule { }