import { Component, OnInit } from '@angular/core';
import { AlgoliaService } from '../../../services/algolia/algolia.service'
@Component({
  selector: 'app-sent-reviews',
  templateUrl: './sent-reviews.component.html',
  styleUrls: ['./sent-reviews.component.css']
})
export class SentReviewsComponent implements OnInit {
  actualUserId:string;
  constructor(private algolia: AlgoliaService) { }

  ngOnInit() {
    this.actualUserId = JSON.parse(localStorage.getItem("user")).id
    this.algolia.getSentReviews(this.actualUserId);
  }

}
