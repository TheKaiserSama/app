import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
import { AuthGuard } from './core/guards/auth.guard';

// Components
import { HomeComponent } from './core/home/home.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
	{ 
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'login',
		loadChildren: () => import('./modules/authentication/authentication.module')
		.then(m => m.AuthenticationModule)
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./modules/dashboard/dashboard.module')
		.then(m => m.DashboardModule),
		canActivate: [AuthGuard]
	},
	// Ruta por defecto
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	// En caso de que halla un error ("404 - Not Found")
    { 
		path: '**',
		component: PageNotFoundComponent
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }