import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsFormComponent } from './labels-form.component';

describe('LabelsFormComponent', () => {
  let component: LabelsFormComponent;
  let fixture: ComponentFixture<LabelsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
