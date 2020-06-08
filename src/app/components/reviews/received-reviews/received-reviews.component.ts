import { Component, OnInit } from '@angular/core';
import { AlgoliaService } from '../../../services/algolia/algolia.service'
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-received-reviews',
  templateUrl: './received-reviews.component.html',
  styleUrls: ['../my-reviews/my-reviews.component.css']
})
export class ReceivedReviewsComponent implements OnInit {
  userId:string;
  reviews: any;
  constructor(private algolia: AlgoliaService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.getData();
  }
  async getData(){
    if(this._route.snapshot.queryParams['u']){
      this.userId = this._route.snapshot.queryParams['u'];
    }else{
      this.userId = JSON.parse(localStorage.getItem("user")).id;
    }
    
    
    
    this.reviews = await this.algolia.getReceivedReviews(this.userId);
    if(this.reviews.length < 1)
      this.reviews = false;
  }
}
