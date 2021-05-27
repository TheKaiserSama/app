import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarResumenActividadesComponent } from './listar-resumen-actividades.component';

describe('ListarResumenActividadesComponent', () => {
	let component: ListarResumenActividadesComponent;
	let fixture: ComponentFixture<ListarResumenActividadesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarResumenActividadesComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarResumenActividadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});