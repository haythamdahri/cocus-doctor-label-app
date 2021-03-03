import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseslabelingComponent } from './caseslabeling.component';

describe('CaseslabelingComponent', () => {
  let component: CaseslabelingComponent;
  let fixture: ComponentFixture<CaseslabelingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseslabelingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseslabelingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
