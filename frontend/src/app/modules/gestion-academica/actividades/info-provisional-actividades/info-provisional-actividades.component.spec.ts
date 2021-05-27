import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoProvisionalActividadesComponent } from './info-provisional-actividades.component';

describe('InfoProvisionalActividadesComponent', () => {
	let component: InfoProvisionalActividadesComponent;
	let fixture: ComponentFixture<InfoProvisionalActividadesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InfoProvisionalActividadesComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoProvisionalActividadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});