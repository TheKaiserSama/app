import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartEstudianteActividadesComponent } from './bar-chart-estudiante-actividades.component';

describe('BarChartEstudianteActividadesComponent', () => {
	let component: BarChartEstudianteActividadesComponent;
	let fixture: ComponentFixture<BarChartEstudianteActividadesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ BarChartEstudianteActividadesComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BarChartEstudianteActividadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});