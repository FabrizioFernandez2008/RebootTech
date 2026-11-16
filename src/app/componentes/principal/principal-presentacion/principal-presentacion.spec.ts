import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrincipalPresentacion } from './principal-presentacion';

describe('PrincipalPresentacion', () => {
  let component: PrincipalPresentacion;
  let fixture: ComponentFixture<PrincipalPresentacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalPresentacion],
    }).compileComponents();

    fixture = TestBed.createComponent(PrincipalPresentacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
