import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InasistenciaEstudianteComponent } from './inasistencia-estudiante.component';

describe('InasistenciaEstudianteComponent', () => {
	let component: InasistenciaEstudianteComponent;
	let fixture: ComponentFixture<InasistenciaEstudianteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InasistenciaEstudianteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InasistenciaEstudianteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});