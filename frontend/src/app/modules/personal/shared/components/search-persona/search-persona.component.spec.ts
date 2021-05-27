import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPersonaComponent } from './search-persona.component';

describe('SearchPersonaComponent', () => {
	let component: SearchPersonaComponent;
	let fixture: ComponentFixture<SearchPersonaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ SearchPersonaComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchPersonaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});