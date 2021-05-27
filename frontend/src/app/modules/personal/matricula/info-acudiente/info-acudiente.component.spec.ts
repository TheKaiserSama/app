import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAcudienteComponent } from './info-acudiente.component';

describe('InfoAcudienteComponent', () => {
	let component: InfoAcudienteComponent;
	let fixture: ComponentFixture<InfoAcudienteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InfoAcudienteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoAcudienteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});