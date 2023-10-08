import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesEditComponent } from './clientes-edit.component';

describe('ClientesEditComponent', () => {
  let component: ClientesEditComponent;
  let fixture: ComponentFixture<ClientesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
