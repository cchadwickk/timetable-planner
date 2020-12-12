import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCourseListsComponent } from './guest-course-lists.component';

describe('GuestCourseListsComponent', () => {
  let component: GuestCourseListsComponent;
  let fixture: ComponentFixture<GuestCourseListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestCourseListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestCourseListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
