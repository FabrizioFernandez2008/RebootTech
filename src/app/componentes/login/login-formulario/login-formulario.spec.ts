import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginFormulario } from './login-formulario';

describe('LoginFormulario', () => {
  let component: LoginFormulario;
  let fixture: ComponentFixture<LoginFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
