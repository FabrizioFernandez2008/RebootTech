import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorResumen } from './administrador-resumen';

describe('AdministradorResumen', () => {
  let component: AdministradorResumen;
  let fixture: ComponentFixture<AdministradorResumen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministradorResumen],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministradorResumen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
