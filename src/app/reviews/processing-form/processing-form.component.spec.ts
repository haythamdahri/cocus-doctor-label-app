import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingFormComponent } from './processing-form.component';

describe('ProcessingFormComponent', () => {
  let component: ProcessingFormComponent;
  let fixture: ComponentFixture<ProcessingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
