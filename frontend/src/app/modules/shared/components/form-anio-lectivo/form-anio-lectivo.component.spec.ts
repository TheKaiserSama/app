import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnioLectivoComponent } from './form-anio-lectivo.component';

describe('FormAnioLectivoComponent', () => {
	let component: FormAnioLectivoComponent;
	let fixture: ComponentFixture<FormAnioLectivoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormAnioLectivoComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormAnioLectivoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});