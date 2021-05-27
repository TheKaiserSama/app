import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIndicadorComponent } from './card-indicador.component';

describe('CardIndicadorComponent', () => {
	let component: CardIndicadorComponent;
	let fixture: ComponentFixture<CardIndicadorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CardIndicadorComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CardIndicadorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});