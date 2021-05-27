import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCargaAcademicaDocenteComponent } from './form-carga-academica-docente.component';

describe('FormCargaAcademicaDocenteComponent', () => {
	let component: FormCargaAcademicaDocenteComponent;
	let fixture: ComponentFixture<FormCargaAcademicaDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormCargaAcademicaDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormCargaAcademicaDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});