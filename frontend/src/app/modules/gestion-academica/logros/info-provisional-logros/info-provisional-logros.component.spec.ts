import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoProvisionalLogrosComponent } from './info-provisional-logros.component';

describe('InfoProvisionalLogrosComponent', () => {
	let component: InfoProvisionalLogrosComponent;
	let fixture: ComponentFixture<InfoProvisionalLogrosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InfoProvisionalLogrosComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoProvisionalLogrosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});