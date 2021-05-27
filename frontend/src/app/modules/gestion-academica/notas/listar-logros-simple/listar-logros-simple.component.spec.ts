import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLogrosSimpleComponent } from './listar-logros-simple.component';

describe('ListarLogrosSimpleComponent', () => {
	let component: ListarLogrosSimpleComponent;
	let fixture: ComponentFixture<ListarLogrosSimpleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarLogrosSimpleComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarLogrosSimpleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});