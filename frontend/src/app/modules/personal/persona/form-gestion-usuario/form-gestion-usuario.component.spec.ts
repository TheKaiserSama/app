import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGestionUsuarioComponent } from './form-gestion-usuario.component';

describe('FormGestionUsuarioComponent', () => {
	let component: FormGestionUsuarioComponent;
	let fixture: ComponentFixture<FormGestionUsuarioComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormGestionUsuarioComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormGestionUsuarioComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});