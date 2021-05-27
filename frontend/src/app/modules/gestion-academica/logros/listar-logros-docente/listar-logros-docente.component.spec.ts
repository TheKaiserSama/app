import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLogrosDocenteComponent } from './listar-logros-docente.component';

describe('ListarLogrosDocenteComponent', () => {
	let component: ListarLogrosDocenteComponent;
	let fixture: ComponentFixture<ListarLogrosDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarLogrosDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarLogrosDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
