import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTimetablesComponent } from './guest-timetables.component';

describe('GuestTimetablesComponent', () => {
  let component: GuestTimetablesComponent;
  let fixture: ComponentFixture<GuestTimetablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestTimetablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestTimetablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
