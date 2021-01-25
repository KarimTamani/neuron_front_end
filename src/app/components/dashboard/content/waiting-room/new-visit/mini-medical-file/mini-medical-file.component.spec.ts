import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniMedicalFileComponent } from './mini-medical-file.component';

describe('MiniMedicalFileComponent', () => {
  let component: MiniMedicalFileComponent;
  let fixture: ComponentFixture<MiniMedicalFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniMedicalFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniMedicalFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
