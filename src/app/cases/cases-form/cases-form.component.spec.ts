import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesFormComponent } from './cases-form.component';

describe('CasesFormComponent', () => {
  let component: CasesFormComponent;
  let fixture: ComponentFixture<CasesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
