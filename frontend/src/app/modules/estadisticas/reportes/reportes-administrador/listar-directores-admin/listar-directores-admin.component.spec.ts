import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDirectoresAdminComponent } from './listar-directores-admin.component';

describe('ListarDirectoresAdminComponent', () => {
  let component: ListarDirectoresAdminComponent;
  let fixture: ComponentFixture<ListarDirectoresAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarDirectoresAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarDirectoresAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
