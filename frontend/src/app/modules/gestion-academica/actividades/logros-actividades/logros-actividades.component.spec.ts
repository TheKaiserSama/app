import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogrosActividadesComponent } from './logros-actividades.component';

describe('LogrosActividadesComponent', () => {
	let component: LogrosActividadesComponent;
	let fixture: ComponentFixture<LogrosActividadesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ LogrosActividadesComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LogrosActividadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
