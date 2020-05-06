import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedReviewsComponent } from './received-reviews.component';

describe('ReceivedReviewsComponent', () => {
  let component: ReceivedReviewsComponent;
  let fixture: ComponentFixture<ReceivedReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
