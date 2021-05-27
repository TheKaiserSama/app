import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoConsolidadoComponent } from './formato-consolidado.component';

describe('FormatoConsolidadoComponent', () => {
	let component: FormatoConsolidadoComponent;
	let fixture: ComponentFixture<FormatoConsolidadoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ FormatoConsolidadoComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FormatoConsolidadoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
