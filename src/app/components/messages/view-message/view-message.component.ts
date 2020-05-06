import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { AlgoliaService } from '../../../services/algolia/algolia.service'

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.component.html',
  styleUrls: ['./view-message.component.css']
})
export class ViewMessageComponent implements OnInit {
  public msgID: string;
  msgInfo: {};
  userInfo: {};

  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService) { }

  ngOnInit() {
    this.getData();
  }
 

  async getData(){
    this.msgID = this._route.snapshot.paramMap.get('msgId');

    await this.algolia.setOnLocalStorageById("messages", this.msgID, "tmpMsg");
    await this.algolia.setOnLocalStorageById("user-profiles", JSON.parse(localStorage.getItem("tmpMsg")).from_id, "tmpUser");

    this.msgInfo = JSON.parse(localStorage.getItem('tmpMsg'));
    this.userInfo = JSON.parse(localStorage.getItem('tmpUser'));

    localStorage.removeItem('tmpUser');
    localStorage.removeItem('tmpMsg');
  }

}
