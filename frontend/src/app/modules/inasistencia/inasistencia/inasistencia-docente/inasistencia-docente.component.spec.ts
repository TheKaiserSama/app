import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InasistenciaDocenteComponent } from './inasistencia-docente.component';

describe('InasistenciaDocenteComponent', () => {
	let component: InasistenciaDocenteComponent;
	let fixture: ComponentFixture<InasistenciaDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InasistenciaDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InasistenciaDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});