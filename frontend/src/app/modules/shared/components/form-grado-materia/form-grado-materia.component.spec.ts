import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGradoMateriaComponent } from './form-grado-materia.component';

describe('FormCursoMateriaComponent', () => {
	let component: FormGradoMateriaComponent;
	let fixture: ComponentFixture<FormGradoMateriaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormGradoMateriaComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormGradoMateriaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});