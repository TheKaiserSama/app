import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionEstudianteComponent } from './notificacion-estudiante.component';

describe('NotificacionEstudianteComponent', () => {
	let component: NotificacionEstudianteComponent;
	let fixture: ComponentFixture<NotificacionEstudianteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ NotificacionEstudianteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificacionEstudianteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});