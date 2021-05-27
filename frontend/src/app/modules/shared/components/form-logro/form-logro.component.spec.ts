import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLogroComponent } from './form-logro.component';

describe('FormLogroComponent', () => {
	let component: FormLogroComponent;
	let fixture: ComponentFixture<FormLogroComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
		declarations: [ FormLogroComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormLogroComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});