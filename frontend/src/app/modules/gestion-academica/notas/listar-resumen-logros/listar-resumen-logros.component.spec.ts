import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarResumenLogrosComponent } from './listar-resumen-logros.component';

describe('ListarResumenLogrosComponent', () => {
	let component: ListarResumenLogrosComponent;
	let fixture: ComponentFixture<ListarResumenLogrosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarResumenLogrosComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarResumenLogrosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});