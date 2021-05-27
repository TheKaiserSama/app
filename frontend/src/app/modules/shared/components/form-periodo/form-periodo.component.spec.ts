import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPeriodoComponent } from './form-periodo.component';

describe('FormPeriodoComponent', () => {
	let component: FormPeriodoComponent;
	let fixture: ComponentFixture<FormPeriodoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormPeriodoComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormPeriodoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});