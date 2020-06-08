import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/services/shared/shared.service';



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
  toMain = [];
  userID: string;
  avatar: string;
  gender: string;
  loggedUserID: string;
  actualUser:boolean;

  
  constructor(
    private _route: ActivatedRoute,
    private algolia: AlgoliaService,
    private titleService: Title,
    private shared: SharedService
  ) { }

  ngOnInit() {
    if(localStorage.getItem("user")){
      this.loggedUserID = JSON.parse(localStorage.getItem("user")).id
    }
    this.getData();
  }

  async getData(){
    
    this.itemID = this._route.snapshot.queryParams['i'];

    
    this.itemInfo = await this.algolia.getItemById(this.itemID);
    this.titleService.setTitle( this.itemInfo['title']);
    this.userInfo = await this.algolia.getUserById(this.itemInfo["user_id"]);
    
    this.userID = this.itemInfo["user_id"];
    this.toMain.push(this.itemInfo['main_photo']);
    this.usergender = this.userInfo['gender'];
    this.userPoints = await this.algolia.getUserPoints(this.userInfo['objectID']);
    this.reviewsNumber = await this.algolia.getNumberOfReviews(this.userInfo['objectID']);
    this.photos = JSON.parse(this.itemInfo["photos"]);

    if(this.userInfo['avatar'] !== "no-avatar.png")
        this.avatar = "url("+this.userInfo['avatar']+")";
      else
        this.avatar = "url('../../../assets/img/no-avatar.png')";
    switch(this.userInfo['gender']){
      case "male": this.gender = "../../../assets/img/men.svg";break;
      case "female": this.gender = "../../../assets/img/women.svg";break;
      default: this.gender = "../../../assets/img/other.svg";break;
    }

    this.actualUser = this.checkactualuser();

  }
  selectImage(img){

    if(this.toMain.length > 0)
      this.toMain.splice(0);

    this.toMain.push(img);
         
  }
  delete(id){
    this.shared.openDeleteForSureDialog(id);
  }
  contact(){
    window.location.href = './inbox?type=sent';
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
