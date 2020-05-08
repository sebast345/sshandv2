import { Component, OnInit } from '@angular/core';
import { AlgoliaService } from '../../../services/algolia/algolia.service'
@Component({
  selector: 'app-sent-reviews',
  templateUrl: './sent-reviews.component.html',
  styleUrls: ['./sent-reviews.component.css']
})
export class SentReviewsComponent implements OnInit {
  actualUserId:string;
  reviews: {};
  constructor(private algolia: AlgoliaService) { }

  ngOnInit() {
    this.getData();
  }
  async getData(){
    this.actualUserId = JSON.parse(localStorage.getItem("user")).id;
    
    this.reviews = await this.algolia.getSentReviews(this.actualUserId);
    console.log(this.reviews); 
  }
}
