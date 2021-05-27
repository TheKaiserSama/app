import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPeriodosComponent } from './listar-periodos.component';

describe('ListarPeriodosComponent', () => {
	let component: ListarPeriodosComponent;
	let fixture: ComponentFixture<ListarPeriodosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarPeriodosComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarPeriodosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});