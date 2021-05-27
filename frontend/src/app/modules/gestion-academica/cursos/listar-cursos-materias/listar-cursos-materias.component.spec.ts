import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCursosMateriasComponent } from './listar-cursos-materias.component';

describe('ListarCursosMateriasComponent', () => {
	let component: ListarCursosMateriasComponent;
	let fixture: ComponentFixture<ListarCursosMateriasComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarCursosMateriasComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarCursosMateriasComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});