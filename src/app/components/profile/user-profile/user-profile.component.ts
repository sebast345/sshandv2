import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlgoliaService } from '../../../services/algolia/algolia.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public loggedUserID =  JSON.parse(localStorage.getItem("user")).id;
  public userID: string;
  userInfo: {};
  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService) { }

  ngOnInit() {
    this.getData();
  }

  async getData(){
    this.userID = this._route.snapshot.paramMap.get('userId');

    this. userInfo = await this.algolia.getUserById(this.userID);
    
  }
}
