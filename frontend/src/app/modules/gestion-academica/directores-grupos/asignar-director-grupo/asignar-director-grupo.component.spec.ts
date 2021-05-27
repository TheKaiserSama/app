import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarDirectorGrupoComponent } from './asignar-director-grupo.component';

describe('AsignarDirectorGrupoComponent', () => {
	let component: AsignarDirectorGrupoComponent;
	let fixture: ComponentFixture<AsignarDirectorGrupoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ AsignarDirectorGrupoComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AsignarDirectorGrupoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
