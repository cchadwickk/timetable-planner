import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestResultsComponent } from './guest-results.component';

describe('GuestResultsComponent', () => {
  let component: GuestResultsComponent;
  let fixture: ComponentFixture<GuestResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
