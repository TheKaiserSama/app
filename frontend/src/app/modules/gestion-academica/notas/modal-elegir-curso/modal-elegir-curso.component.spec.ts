import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalElegirCursoComponent } from './modal-elegir-curso.component';

describe('ModalElegirCursoComponent', () => {
	let component: ModalElegirCursoComponent;
	let fixture: ComponentFixture<ModalElegirCursoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ModalElegirCursoComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ModalElegirCursoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});