import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionDocenteComponent } from './notificacion-docente.component';

describe('NotificacionDocenteComponent', () => {
	let component: NotificacionDocenteComponent;
	let fixture: ComponentFixture<NotificacionDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ NotificacionDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotificacionDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});