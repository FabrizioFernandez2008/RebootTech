import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecepcionEncabezado } from './recepcion-encabezado';

describe('RecepcionEncabezado', () => {
  let component: RecepcionEncabezado;
  let fixture: ComponentFixture<RecepcionEncabezado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecepcionEncabezado],
    }).compileComponents();

    fixture = TestBed.createComponent(RecepcionEncabezado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
