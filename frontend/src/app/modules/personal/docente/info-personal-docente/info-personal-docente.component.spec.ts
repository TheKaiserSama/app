import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPersonalDocenteComponent } from './info-personal-docente.component';

describe('InfoPersonalDocenteComponent', () => {
	let component: InfoPersonalDocenteComponent;
	let fixture: ComponentFixture<InfoPersonalDocenteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InfoPersonalDocenteComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoPersonalDocenteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});