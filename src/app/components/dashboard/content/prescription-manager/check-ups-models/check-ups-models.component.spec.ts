import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpsModelsComponent } from './check-ups-models.component';

describe('CheckUpsModelsComponent', () => {
  let component: CheckUpsModelsComponent;
  let fixture: ComponentFixture<CheckUpsModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckUpsModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUpsModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
