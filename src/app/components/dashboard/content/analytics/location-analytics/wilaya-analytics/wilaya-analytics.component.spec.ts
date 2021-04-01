import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WilayaAnalyticsComponent } from './wilaya-analytics.component';

describe('WilayaAnalyticsComponent', () => {
  let component: WilayaAnalyticsComponent;
  let fixture: ComponentFixture<WilayaAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WilayaAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WilayaAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
