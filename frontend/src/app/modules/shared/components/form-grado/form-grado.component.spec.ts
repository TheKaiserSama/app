import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGradoComponent } from './form-grado.component';

describe('FormGradoComponent', () => {
	let component: FormGradoComponent;
	let fixture: ComponentFixture<FormGradoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormGradoComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormGradoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});