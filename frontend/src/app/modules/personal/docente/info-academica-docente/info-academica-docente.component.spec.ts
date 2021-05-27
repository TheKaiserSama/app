import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAcademicaDocenteComponent } from './info-academica-docente.component';

describe('InfoAcademicaDocenteComponent', () => {
	let component: InfoAcademicaDocenteComponent;
	let fixture: ComponentFixture<InfoAcademicaDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InfoAcademicaDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoAcademicaDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});