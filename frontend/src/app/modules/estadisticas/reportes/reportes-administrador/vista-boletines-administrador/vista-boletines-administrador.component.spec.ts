import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaBoletinesAdministradorComponent } from './vista-boletines-administrador.component';

describe('VistaBoletinesAdministradorComponent', () => {
	let component: VistaBoletinesAdministradorComponent;
	let fixture: ComponentFixture<VistaBoletinesAdministradorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ VistaBoletinesAdministradorComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(VistaBoletinesAdministradorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
