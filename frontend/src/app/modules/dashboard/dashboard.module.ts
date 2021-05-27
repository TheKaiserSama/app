import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules : Routing - Shared
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './dashboard/menu/menu.component';
import { PopupMenuComponent } from './dashboard/popup-menu/popup-menu.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeAdminComponent } from './welcome/welcome-admin/welcome-admin.component';
import { WelcomeDocenteComponent } from './welcome/welcome-docente/welcome-docente.component';

@NgModule({
	declarations: [
		DashboardComponent,
		MenuComponent,
		PopupMenuComponent,
		WelcomeComponent,
		WelcomeAdminComponent,
		WelcomeDocenteComponent,
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		SharedModule
	]
})
export class DashboardModule { }