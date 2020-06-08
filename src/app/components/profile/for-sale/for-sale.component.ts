import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { AlgoliaService } from '../../../services/algolia/algolia.service'
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-for-sale',
  templateUrl: './for-sale.component.html',
  styleUrls: ['./for-sale.component.css']
})
export class ForSaleComponent implements OnInit {
  itemsData: [];
  userInfo: [];
  actualUser: boolean;
  loggedUserID: string;
  userID: string;
  constructor(private _route: ActivatedRoute,
    private algolia: AlgoliaService,
    private titleService: Title,
    private shared: SharedService) { }

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
      this.itemsData = await this.algolia.getUserItems(this.loggedUserID);
      this.titleService.setTitle( "Mis artículos" );
    }else{
      this.userInfo = await this.algolia.getUserById(this.userID);
      this.itemsData = await this.algolia.getUserItems(this.userID);
      this.titleService.setTitle( "Artículos de "+this.userInfo['name'] );

    }

  }
  delete(id){
    this.shared.openDeleteForSureDialog(id);
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
