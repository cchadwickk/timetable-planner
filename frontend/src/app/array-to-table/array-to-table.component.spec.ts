import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayToTableComponent } from './array-to-table.component';

describe('ArrayToTableComponent', () => {
  let component: ArrayToTableComponent;
  let fixture: ComponentFixture<ArrayToTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrayToTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayToTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
