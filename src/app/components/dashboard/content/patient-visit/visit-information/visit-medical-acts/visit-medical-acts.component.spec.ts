import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitMedicalActsComponent } from './visit-medical-acts.component';

describe('VisitMedicalActsComponent', () => {
  let component: VisitMedicalActsComponent;
  let fixture: ComponentFixture<VisitMedicalActsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitMedicalActsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitMedicalActsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
