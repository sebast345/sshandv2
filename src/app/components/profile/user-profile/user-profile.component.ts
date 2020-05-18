import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlgoliaService } from '../../../services/algolia/algolia.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public loggedUserID;
  public userID: string;
  userInfo: {};
  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService) { }

  ngOnInit() {
    if(localStorage.getItem("user")){
      this.loggedUserID = JSON.parse(localStorage.getItem("user")).id
    }
    this.getData();
  }

  async getData(){

    this.userID = this._route.snapshot.queryParams['u'];
    if(!this.userID){
      this.userInfo = await this.algolia.getUserById(this.loggedUserID);
    }else{
      this.userInfo = await this.algolia.getUserById(this.userID); 
    }
    
    
  }
}
