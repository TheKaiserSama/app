import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarActividadesSimpleComponent } from './listar-actividades-simple.component';

describe('ListarActividadesSimpleComponent', () => {
	let component: ListarActividadesSimpleComponent;
	let fixture: ComponentFixture<ListarActividadesSimpleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarActividadesSimpleComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarActividadesSimpleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});