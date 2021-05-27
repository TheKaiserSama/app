import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDirectoresGrupoAdminComponent } from './listar-directores-grupo-admin.component';

describe('ListarDirectoresGrupoAdminComponent', () => {
  let component: ListarDirectoresGrupoAdminComponent;
  let fixture: ComponentFixture<ListarDirectoresGrupoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarDirectoresGrupoAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDirectoresGrupoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
