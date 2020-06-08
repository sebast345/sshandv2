import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantEditComponent } from './cant-edit.component';

describe('CantEditComponent', () => {
  let component: CantEditComponent;
  let fixture: ComponentFixture<CantEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
