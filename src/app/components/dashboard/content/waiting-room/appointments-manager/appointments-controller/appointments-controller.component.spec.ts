import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsControllerComponent } from './appointments-controller.component';

describe('AppointmentsControllerComponent', () => {
  let component: AppointmentsControllerComponent;
  let fixture: ComponentFixture<AppointmentsControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentsControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
