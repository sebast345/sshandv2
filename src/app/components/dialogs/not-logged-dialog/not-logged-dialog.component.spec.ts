import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoggedDialogComponent } from './not-logged-dialog.component';

describe('NotLoggedDialogComponent', () => {
  let component: NotLoggedDialogComponent;
  let fixture: ComponentFixture<NotLoggedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotLoggedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLoggedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
