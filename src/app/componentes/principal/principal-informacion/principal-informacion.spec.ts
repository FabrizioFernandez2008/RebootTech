import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrincipalInformacion } from './principal-informacion';

describe('PrincipalInformacion', () => {
  let component: PrincipalInformacion;
  let fixture: ComponentFixture<PrincipalInformacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalInformacion],
    }).compileComponents();

    fixture = TestBed.createComponent(PrincipalInformacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
