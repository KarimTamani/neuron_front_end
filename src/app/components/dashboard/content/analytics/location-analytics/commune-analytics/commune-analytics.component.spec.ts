import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommuneAnalyticsComponent } from './commune-analytics.component';

describe('CommuneAnalyticsComponent', () => {
  let component: CommuneAnalyticsComponent;
  let fixture: ComponentFixture<CommuneAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommuneAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommuneAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
