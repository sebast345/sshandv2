import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.css']
})
export class UserReviewsComponent implements OnInit {
  userId: string;
  userInfo: {};
  reviews: {};
  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService) { 
    this.userId = this._route.snapshot.queryParams['u']; 
  }

  ngOnInit() {
    
  }
  async getData(){
    this.reviews = await this.algolia.getReceivedReviews(this.userId);
    console.log(this.reviews); 
  }
}
