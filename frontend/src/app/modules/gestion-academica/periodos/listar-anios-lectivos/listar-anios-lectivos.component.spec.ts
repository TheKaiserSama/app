import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAniosLectivosComponent } from './listar-anios-lectivos.component';

describe('ListarAniosLectivosComponent', () => {
	let component: ListarAniosLectivosComponent;
	let fixture: ComponentFixture<ListarAniosLectivosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarAniosLectivosComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarAniosLectivosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});