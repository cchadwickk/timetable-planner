import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableTableWithButtonsComponent } from './expandable-table-with-buttons.component';

describe('ExpandableTableWithButtonsComponent', () => {
  let component: ExpandableTableWithButtonsComponent;
  let fixture: ComponentFixture<ExpandableTableWithButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpandableTableWithButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandableTableWithButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
