import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginEncabezado } from './login-encabezado';

describe('LoginEncabezado', () => {
  let component: LoginEncabezado;
  let fixture: ComponentFixture<LoginEncabezado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginEncabezado],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginEncabezado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
