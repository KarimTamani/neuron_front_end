import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitCheckUpComponent } from './visit-check-up.component';

describe('VisitCheckUpComponent', () => {
  let component: VisitCheckUpComponent;
  let fixture: ComponentFixture<VisitCheckUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitCheckUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitCheckUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
