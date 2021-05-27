import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValoracionFormativaComponent } from './form-valoracion-formativa.component';

describe('FormValoracionFormativaComponent', () => {
	let component: FormValoracionFormativaComponent;
	let fixture: ComponentFixture<FormValoracionFormativaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormValoracionFormativaComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormValoracionFormativaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
