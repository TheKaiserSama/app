import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Routing
import { AuthenticationRoutingModule } from './authentication-routing.module';

// Components
import { LoginComponent } from './login/login.component';

@NgModule({
	declarations: [
		LoginComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AuthenticationRoutingModule
	]
})
export class AuthenticationModule { }