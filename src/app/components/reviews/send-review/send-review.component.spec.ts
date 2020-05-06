import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendReviewComponent } from './send-review.component';

describe('SendReviewComponent', () => {
  let component: SendReviewComponent;
  let fixture: ComponentFixture<SendReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
