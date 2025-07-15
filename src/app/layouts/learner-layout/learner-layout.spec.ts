import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerLayout } from './learner-layout';

describe('LearnerLayout', () => {
  let component: LearnerLayout;
  let fixture: ComponentFixture<LearnerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearnerLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
