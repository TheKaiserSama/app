import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanDocenteAdminComponent } from './listar-plan-docente-admin.component';

describe('ListarPlanDocenteAdminComponent', () => {
  let component: ListarPlanDocenteAdminComponent;
  let fixture: ComponentFixture<ListarPlanDocenteAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarPlanDocenteAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarPlanDocenteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
