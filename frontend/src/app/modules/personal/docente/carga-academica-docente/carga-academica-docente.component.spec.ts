import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaAcademicaDocenteComponent } from './carga-academica-docente.component';

describe('CargaAcademicaDocenteComponent', () => {
	let component: CargaAcademicaDocenteComponent;
	let fixture: ComponentFixture<CargaAcademicaDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CargaAcademicaDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CargaAcademicaDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});