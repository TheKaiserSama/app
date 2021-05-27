import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirBoletinesComponent } from './imprimir-boletines.component';

describe('ImprimirBoletinesComponent', () => {
	let component: ImprimirBoletinesComponent;
	let fixture: ComponentFixture<ImprimirBoletinesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ImprimirBoletinesComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ImprimirBoletinesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
