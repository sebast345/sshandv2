import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentReviewsComponent } from './sent-reviews.component';

describe('SentReviewsComponent', () => {
  let component: SentReviewsComponent;
  let fixture: ComponentFixture<SentReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
