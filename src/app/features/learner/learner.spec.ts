import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Learner } from './learner';

describe('Learner', () => {
  let component: Learner;
  let fixture: ComponentFixture<Learner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Learner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Learner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
