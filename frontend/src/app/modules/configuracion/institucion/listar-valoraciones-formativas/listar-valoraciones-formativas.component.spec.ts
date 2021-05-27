import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarValoracionesFormativasComponent } from './listar-valoraciones-formativas.component';

describe('ListarValoracionesFormativasComponent', () => {
	let component: ListarValoracionesFormativasComponent;
	let fixture: ComponentFixture<ListarValoracionesFormativasComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarValoracionesFormativasComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarValoracionesFormativasComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
