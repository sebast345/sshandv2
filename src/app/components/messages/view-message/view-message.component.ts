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

    this.msgInfo = await this.algolia.getMessageById(this.msgID);
    console.log(this.msgInfo);
    this.userInfo = await this.algolia.getUserById(this.msgInfo["from_id"]);

  }

}
