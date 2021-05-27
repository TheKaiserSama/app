import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoresGruposComponent } from './directores-grupos.component';

describe('DirectoresGruposComponent', () => {
	let component: DirectoresGruposComponent;
	let fixture: ComponentFixture<DirectoresGruposComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ DirectoresGruposComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DirectoresGruposComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
