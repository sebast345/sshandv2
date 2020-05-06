import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  mode: string;
  constructor(private _route: ActivatedRoute) { }

  ngOnInit() {
    this.mode = this._route.snapshot.queryParams['mode'];
  }

}
