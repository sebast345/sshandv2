import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.css']
})
export class MyReviewsComponent implements OnInit {
  type: string;
  selected = 'sent';
  constructor(private _route: ActivatedRoute, private titleService: Title) { 
    this.type = this._route.snapshot.queryParams['type'];
  }

  ngOnInit() {
    this.titleService.setTitle( "Mis opiniones" );
  }

}
