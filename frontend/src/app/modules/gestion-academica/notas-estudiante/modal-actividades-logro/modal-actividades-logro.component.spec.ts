import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActividadesLogroComponent } from './modal-actividades-logro.component';

describe('ModalActividadesLogroComponent', () => {
	let component: ModalActividadesLogroComponent;
	let fixture: ComponentFixture<ModalActividadesLogroComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ModalActividadesLogroComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalActividadesLogroComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});