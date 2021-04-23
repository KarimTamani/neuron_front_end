import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionManagerComponent } from './prescription-manager.component';

describe('PrescriptionManagerComponent', () => {
  let component: PrescriptionManagerComponent;
  let fixture: ComponentFixture<PrescriptionManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrescriptionManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
