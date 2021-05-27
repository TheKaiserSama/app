import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDirectoresGrupoComponent } from './listar-directores-grupo.component';

describe('ListarDirectoresGrupoComponent', () => {
	let component: ListarDirectoresGrupoComponent;
	let fixture: ComponentFixture<ListarDirectoresGrupoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ ListarDirectoresGrupoComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarDirectoresGrupoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
