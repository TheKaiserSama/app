import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLogrosComponent } from './modal-logros.component';

describe('ModalLogrosComponent', () => {
	let component: ModalLogrosComponent;
	let fixture: ComponentFixture<ModalLogrosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
		declarations: [ ModalLogrosComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalLogrosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});