import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlgoliaService } from '../../../services/algolia/algolia.service'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  loggedUserID: string;
  avatar: string;
  userID: string;
  userInfo: {};
  userPoints: string;
  reviewsNumber: string;
  ageNumber: number;
  itemsNumber: number;
  actualUser: boolean;
  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService) { }

  ngOnInit() {
    if(localStorage.getItem("user")){
      this.loggedUserID = JSON.parse(localStorage.getItem("user")).id
    }
    this.actualUser = this.checkactualuser();
    this.getData();

  }

  async getData(){ 
    this.userID = this._route.snapshot.queryParams['u'];
    if(!this.userID){
      this.userInfo = await this.algolia.getUserById(this.loggedUserID);
    }else{
      this.userInfo = await this.algolia.getUserById(this.userID); 
    }
    this.userPoints = await this.algolia.getUserPoints(this.userInfo['objectID']);
    this.reviewsNumber = await this.algolia.getNumberOfReviews(this.userInfo['objectID']);
    this.itemsNumber = await this.algolia.getUserItems(this.userInfo['objectID']);

    var date = new Date(this.userInfo['age']);
    this.ageNumber = this.calculateAge(date);
    if(this.userInfo['avatar'] !== "no-avatar.png")
        this.avatar = "url('"+this.userInfo['avatar']+"')";
      else
        this.avatar = "url(../../../assets/img/no-avatar.png)"
    
    
  }
  calculateAge(age: Date){
    var ageDifMs = Date.now() - age.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  checkactualuser(){
    if(!this.userID){
      return true;
    }else{
      if(this.userID == this.loggedUserID){
        return false;
      }else{
        return true;
      }
    }
  }
}
