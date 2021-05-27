import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMatriculaComponent } from './info-matricula.component';

describe('InfoMatriculaComponent', () => {
	let component: InfoMatriculaComponent;
	let fixture: ComponentFixture<InfoMatriculaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ InfoMatriculaComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InfoMatriculaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});