import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanesDocenteComponent } from './listar-planes-docente.component';

describe('ListarPlanesDocenteComponent', () => {
	let component: ListarPlanesDocenteComponent;
	let fixture: ComponentFixture<ListarPlanesDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarPlanesDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarPlanesDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
