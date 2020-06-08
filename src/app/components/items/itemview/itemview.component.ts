import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { searchClient, AlgoliaService } from '../../../services/algolia/algolia.service';
import { Title } from '@angular/platform-browser';


const itemsDB = searchClient.initIndex('items');
const usersDB = searchClient.initIndex('user-profiles');

@Component({
  selector: 'app-itemview',
  templateUrl: './itemview.component.html',
  styleUrls: ['./itemview.component.css']
})
export class ItemviewComponent implements OnInit {
  public itemID: string;
  usergender: string;
  userPoints: string;
  reviewsNumber: number;
  itemInfo: {};
  userInfo: {};
  photos: {};

  
  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private algolia: AlgoliaService,
    private titleService: Title
  ) { }

  ngOnInit() {

    this.getData();
  }

  async getData(){
    
    this.itemID = this._route.snapshot.queryParams['i'];

    
    this.itemInfo = await this.algolia.getItemById(this.itemID);
    this.titleService.setTitle( this.itemInfo['title']);
    this.userInfo = await this.algolia.getUserById(this.itemInfo["user_id"]);
    
    
    this.usergender = this.userInfo['gender'];
    this.userPoints = await this.algolia.getUserPoints(this.userInfo['objectID']);
    this.reviewsNumber = await this.algolia.getNumberOfReviews(this.userInfo['objectID']);
    this.photos = JSON.parse(this.itemInfo["photos"]);

  }
}
