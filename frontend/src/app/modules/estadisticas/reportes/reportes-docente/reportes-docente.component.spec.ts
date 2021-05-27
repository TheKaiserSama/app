import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesDocenteComponent } from './reportes-docente.component';

describe('ReportesDocenteComponent', () => {
	let component: ReportesDocenteComponent;
	let fixture: ComponentFixture<ReportesDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ReportesDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ReportesDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
