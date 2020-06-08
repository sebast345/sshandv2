import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteForSureComponent } from './delete-for-sure.component';

describe('DeleteForSureComponent', () => {
  let component: DeleteForSureComponent;
  let fixture: ComponentFixture<DeleteForSureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteForSureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteForSureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
