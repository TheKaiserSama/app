import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarLogrosComponent } from './listar-logros.component';

describe('ListarLogrosComponent', () => {
	let component: ListarLogrosComponent;
	let fixture: ComponentFixture<ListarLogrosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarLogrosComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarLogrosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});