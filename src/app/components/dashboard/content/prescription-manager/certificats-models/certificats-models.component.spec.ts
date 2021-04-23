import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatsModelsComponent } from './certificats-models.component';

describe('CertificatsModelsComponent', () => {
  let component: CertificatsModelsComponent;
  let fixture: ComponentFixture<CertificatsModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificatsModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificatsModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
