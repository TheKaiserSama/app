import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarGruposComponent } from './listar-grupos.component';

describe('ListarGruposComponent', () => {
	let component: ListarGruposComponent;
	let fixture: ComponentFixture<ListarGruposComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarGruposComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarGruposComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});