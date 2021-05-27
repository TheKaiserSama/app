import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActividadesComponent } from './modal-actividades.component';

describe('ModalActividadesComponent', () => {
	let component: ModalActividadesComponent;
	let fixture: ComponentFixture<ModalActividadesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ModalActividadesComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalActividadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});