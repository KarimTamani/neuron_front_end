import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDocumentsComponent } from './visit-documents.component';

describe('VisitDocumentsComponent', () => {
  let component: VisitDocumentsComponent;
  let fixture: ComponentFixture<VisitDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
