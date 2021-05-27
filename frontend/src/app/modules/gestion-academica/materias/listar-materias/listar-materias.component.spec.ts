import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarMateriasComponent } from './listar-materias.component';

describe('ListarMateriasComponent', () => {
	let component: ListarMateriasComponent;
	let fixture: ComponentFixture<ListarMateriasComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarMateriasComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarMateriasComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});