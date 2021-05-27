import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCargaAcademicaDocenteComponent } from './listar-carga-academica-docente.component';

describe('ListarCargaAcademicaDocenteComponent', () => {
	let component: ListarCargaAcademicaDocenteComponent;
	let fixture: ComponentFixture<ListarCargaAcademicaDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarCargaAcademicaDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarCargaAcademicaDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});