import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { AlgoliaService } from '../../../services/algolia/algolia.service'
import { Title } from '@angular/platform-browser';


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
  userPoints;
  reviewsNumber: string;
  ageNumber: number;
  itemsNumber: number;
  actualUser: boolean;
  alreadyReviewed:any;
  gender: string;
  constructor(private _route: ActivatedRoute,
     private algolia: AlgoliaService,
     private titleService: Title) { 
      
      
     }

  ngOnInit() {
        if(localStorage.getItem("user")){
          this.loggedUserID = JSON.parse(localStorage.getItem("user")).id
        }
        this.getData();
        this.actualUser = this.checkactualuser();

  }

  async getData(){ 
    this.userID = this._route.snapshot.queryParams['u'];
    if(!this.userID){
      this.userInfo = await this.algolia.getUserById(this.loggedUserID);
      this.titleService.setTitle( "Mi perfil" );
    }else{
      this.userInfo = await this.algolia.getUserById(this.userID);
      this.alreadyReviewed = await this.algolia.getReviewToUser(this.userID);
      this.titleService.setTitle( "Perfil de "+this.userInfo['name'] );

    }
    this.userPoints = await this.algolia.getUserPoints(this.userInfo['objectID']);
    if(isNaN(this.userPoints)){
      this.userPoints = null;
    }
    this.reviewsNumber = await this.algolia.getNumberOfReviews(this.userInfo['objectID']);
    this.itemsNumber = await this.algolia.getNumberOfItems(this.userInfo['objectID']);

    var date = new Date(this.userInfo['age']);
    this.ageNumber = this.calculateAge(date);
    if(this.userInfo['avatar'] !== "no-avatar.png")
        this.avatar = "url("+this.userInfo['avatar']+")";
      else
        this.avatar = "url('../../../assets/img/no-avatar.png')";
    switch(this.userInfo['gender']){
      case "male": this.gender = "../../../assets/img/men.svg";break;
      case "female": this.gender = "../../../assets/img/women.svg";break;
      default: this.gender = "../../../assets/img/other.svg";break;
    }
    
    
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
        return true;
      }else{
        return false;
      }
    }
  }
}
