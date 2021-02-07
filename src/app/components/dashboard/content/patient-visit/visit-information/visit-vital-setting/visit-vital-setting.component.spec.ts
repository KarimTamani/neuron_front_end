import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitVitalSettingComponent } from './visit-vital-setting.component';

describe('VisitVitalSettingComponent', () => {
  let component: VisitVitalSettingComponent;
  let fixture: ComponentFixture<VisitVitalSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitVitalSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitVitalSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
