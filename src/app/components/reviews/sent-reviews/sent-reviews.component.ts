import { Component, OnInit } from '@angular/core';
import { AlgoliaService } from '../../../services/algolia/algolia.service'
@Component({
  selector: 'app-sent-reviews',
  templateUrl: './sent-reviews.component.html',
  styleUrls: ['../my-reviews/my-reviews.component.css']
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
    
    this.reviews = await this.algolia.getSentReviews();
    console.log(this.reviews); 
  }
}
