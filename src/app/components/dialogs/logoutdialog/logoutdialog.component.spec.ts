import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutdialogComponent } from './logoutdialog.component';

describe('LogoutdialogComponent', () => {
  let component: LogoutdialogComponent;
  let fixture: ComponentFixture<LogoutdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
