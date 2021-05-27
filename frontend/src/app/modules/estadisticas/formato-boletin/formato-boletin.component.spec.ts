import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoBoletinComponent } from './formato-boletin.component';

describe('FormatoBoletinComponent', () => {
	let component: FormatoBoletinComponent;
	let fixture: ComponentFixture<FormatoBoletinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormatoBoletinComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormatoBoletinComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
