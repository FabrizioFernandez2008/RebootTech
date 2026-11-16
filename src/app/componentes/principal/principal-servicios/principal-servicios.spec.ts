import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrincipalServicios } from './principal-servicios';

describe('PrincipalServicios', () => {
  let component: PrincipalServicios;
  let fixture: ComponentFixture<PrincipalServicios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalServicios],
    }).compileComponents();

    fixture = TestBed.createComponent(PrincipalServicios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
