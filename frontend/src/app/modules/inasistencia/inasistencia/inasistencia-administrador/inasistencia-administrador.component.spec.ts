import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InasistenciaAdministradorComponent } from './inasistencia-administrador.component';

describe('InasistenciaAdministradorComponent', () => {
	let component: InasistenciaAdministradorComponent;
	let fixture: ComponentFixture<InasistenciaAdministradorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InasistenciaAdministradorComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InasistenciaAdministradorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});