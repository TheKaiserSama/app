import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarInasistenciaComponent } from './registrar-inasistencia.component';

describe('RegistrarInasistenciaComponent', () => {
	let component: RegistrarInasistenciaComponent;
	let fixture: ComponentFixture<RegistrarInasistenciaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ RegistrarInasistenciaComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RegistrarInasistenciaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});