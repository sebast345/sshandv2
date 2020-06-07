import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.css']
})
export class MyReviewsComponent implements OnInit {
  type: string;
  selected = 'sent';
  constructor(private _route: ActivatedRoute) { 
    this.type = this._route.snapshot.queryParams['type'];
  }

  ngOnInit() {
  }

}
