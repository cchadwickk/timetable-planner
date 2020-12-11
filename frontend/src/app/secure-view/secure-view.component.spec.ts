import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureViewComponent } from './secure-view.component';

describe('SecureViewComponent', () => {
  let component: SecureViewComponent;
  let fixture: ComponentFixture<SecureViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecureViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
