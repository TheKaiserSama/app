import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthenticationService } from '@core/authentication/authentication.service';
import { FooterService } from '@services/footer/footer.service';
import { HeaderService } from '@services/header/header.service';
import { IUsuario } from '@interfaces/all.interface';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

	formLogin: FormGroup;
	usuario: IUsuario;

	constructor(
		private authenticationService: AuthenticationService,
		private footerService: FooterService,
		private formBuilder: FormBuilder,
		private headerService: HeaderService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.headerService.show();
		this.footerService.hide();
		this.initFormPersona();
	}

	ngOnDestroy(): void {
		this.headerService.show();
		this.footerService.show();
	}

	private initFormPersona() {
		this.formLogin = this.formBuilder.group({
			username: ['', [
				Validators.required,
				Validators.minLength(3)
			]],
			password: ['', [
				Validators.required
			]]
		});
	}

	login() {
		if (this.formLogin.invalid) return;
		
		Swal.fire({
			icon: 'info',
            allowOutsideClick: false,
            text: 'Espere por favor'
        });
		Swal.showLoading();
		
		this.usuario = {
			username: this.username.value,
			password: this.password.value
		};
		this.authenticationService.login(this.usuario).subscribe((res) => {
			Swal.close();
			this.router.navigate(['/dashboard']);
		});
	}

	get username(): AbstractControl { return this.formLogin.get('username'); }
	get password(): AbstractControl { return this.formLogin.get('password'); }

}