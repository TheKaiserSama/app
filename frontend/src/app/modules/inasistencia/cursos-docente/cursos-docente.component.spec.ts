import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosDocenteComponent } from './cursos-docente.component';

describe('CursosDocenteComponent', () => {
	let component: CursosDocenteComponent;
	let fixture: ComponentFixture<CursosDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CursosDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CursosDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});