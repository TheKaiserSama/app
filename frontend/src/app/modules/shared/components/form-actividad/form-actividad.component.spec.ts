import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActividadComponent } from './form-actividad.component';

describe('FormActividadComponent', () => {
	let component: FormActividadComponent;
	let fixture: ComponentFixture<FormActividadComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormActividadComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormActividadComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});