import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesAdministradorComponent } from './reportes-administrador.component';

describe('ReportesAdministradorComponent', () => {
	let component: ReportesAdministradorComponent;
	let fixture: ComponentFixture<ReportesAdministradorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ReportesAdministradorComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportesAdministradorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
