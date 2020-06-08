import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-user-reviews',
  templateUrl: './user-reviews.component.html',
  styleUrls: ['../my-reviews/my-reviews.component.css']
})
export class UserReviewsComponent implements OnInit {
  userId: string;
  userInfo: {};
  reviews: {};
  constructor(private _route: ActivatedRoute, 
    private algolia: AlgoliaService, 
    private titleService: Title ) { 
    this.userId = this._route.snapshot.queryParams['u']; 
  }

  ngOnInit() {
    this.getData();
  }
  async getData(){
    this.reviews = await this.algolia.getReceivedReviews(this.userId);
    this.userInfo = await this.algolia.getUserById(this.userId);
    this.titleService.setTitle( "Opiniones de "+this.userInfo['name'] );
  }
}
