import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoInstitucionComponent } from './info-institucion.component';

describe('InfoInstitucionComponent', () => {
	let component: InfoInstitucionComponent;
	let fixture: ComponentFixture<InfoInstitucionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InfoInstitucionComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoInstitucionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});