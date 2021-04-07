import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualAssistantControllerComponent } from './virtual-assistant-controller.component';

describe('VirtualAssistantControllerComponent', () => {
  let component: VirtualAssistantControllerComponent;
  let fixture: ComponentFixture<VirtualAssistantControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualAssistantControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualAssistantControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
