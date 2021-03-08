import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionAnalyticsComponent } from './evolution-analytics.component';

describe('EvolutionAnalyticsComponent', () => {
  let component: EvolutionAnalyticsComponent;
  let fixture: ComponentFixture<EvolutionAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolutionAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolutionAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
