import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuthLayout } from './admin-auth-layout';

describe('AdminAuthLayout', () => {
  let component: AdminAuthLayout;
  let fixture: ComponentFixture<AdminAuthLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAuthLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAuthLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
