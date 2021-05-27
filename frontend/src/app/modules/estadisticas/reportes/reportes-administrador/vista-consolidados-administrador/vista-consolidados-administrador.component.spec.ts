import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaConsolidadosAdministradorComponent } from './vista-consolidados-administrador.component';

describe('VistaConsolidadosAdministradorComponent', () => {
	let component: VistaConsolidadosAdministradorComponent;
	let fixture: ComponentFixture<VistaConsolidadosAdministradorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ VistaConsolidadosAdministradorComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(VistaConsolidadosAdministradorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
