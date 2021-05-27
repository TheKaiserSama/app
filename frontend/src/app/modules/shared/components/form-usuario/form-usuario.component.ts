import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormInitService } from '@services/form-init/form-init.service';
import { PersonaService } from '@services/persona/persona.service';
import { IUsuario } from '@interfaces/all.interface';

@Component({
	selector: 'app-form-usuario',
	templateUrl: './form-usuario.component.html',
	styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit, OnDestroy {

	private unsubscribe = new Subject();
    @Input() button: any;
    @Output() emitUsuario = new EventEmitter<IUsuario>();
    @Output() statusForm = new EventEmitter<boolean>();
    formUsuario: FormGroup;
	
	constructor(
		private formInitService: FormInitService,
		public personaService: PersonaService
	) { }

	ngOnInit(): void {
		this.formUsuario = this.formInitService.getFormUsuario();
		this.personaService.usuario$
		.pipe(takeUntil(this.unsubscribe))
		.subscribe((usuario: IUsuario) => {
			if (!usuario) return;
			this.setUsuario(usuario);
		});
	}

	ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
	}

	getUsuario(): IUsuario {
		return {
			username: this.username.value,
			password: this.password.value
		};
	}
	
	setUsuario(usuario: IUsuario): void {
		const { username, password } = usuario;
		this.username.setValue(username);
		this.password.setValue(password);
		this.confirm_password.setValue(password);
	}

	sendFormUsuario(): void {
		if (this.formUsuario.valid) {
			this.emitUsuario.emit(this.getUsuario());
		} else {
			this.validateAllFormFields(this.formUsuario);
		}
	}

	resetFormUsuario(): void {
		this.formUsuario.reset();
	}

	previousTab(): void {
		const usuario = this.getUsuario();
		this.personaService.setUsuario(usuario);
		this.personaService.setTabActive(1);
	}

	isFieldValid(field: string): boolean {
		return (!this.formUsuario.get(field).valid && this.formUsuario.get(field).touched);
	}

	validateAllFormFields(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	displayFieldCss(field: string) {
		return {
		  	'is-invalid': this.isFieldValid(field)
		};
	}

	get username() { return this.formUsuario.get('username'); }
	get password() { return this.formUsuario.get('password'); }
	get confirm_password() { return this.formUsuario.get('confirm_password'); }

}