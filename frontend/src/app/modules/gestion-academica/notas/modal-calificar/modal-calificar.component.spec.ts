import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCalificarComponent } from './modal-calificar.component';

describe('ModalCalificarComponent', () => {
	let component: ModalCalificarComponent;
	let fixture: ComponentFixture<ModalCalificarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ModalCalificarComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalCalificarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});