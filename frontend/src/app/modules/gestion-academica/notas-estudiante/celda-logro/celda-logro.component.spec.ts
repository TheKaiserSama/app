import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeldaLogroComponent } from './celda-logro.component';

describe('CeldaLogroComponent', () => {
	let component: CeldaLogroComponent;
	let fixture: ComponentFixture<CeldaLogroComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CeldaLogroComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CeldaLogroComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
