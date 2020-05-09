import { Component, OnInit } from '@angular/core';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Message } from '../../../models/message/message.model';




@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})



export class InboxComponent implements OnInit {
  type: string;
  messagesData: {};
  selectedMessages: Message [] = [];
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService, private firestore: FirestoreService) {}
  
  ngOnInit() {
    this.type = this._route.snapshot.queryParams['type'];
    this.getMessagesData();
    
  }
  

  async getMessagesData(){
    switch(this.type){
      case "sent": this.messagesData = await this.algolia.getSentMessages();break;
      case "received": this.messagesData = await this.algolia.getReceivedMessages();break;
      case "archived": this.messagesData = await this.algolia.getArchivedMessages();break;
    }
    console.log(this.messagesData);
  }

  deleteMessages(){
    this.selectedMessages.forEach(message => this.firestore.deleteMsg(message, this.type));
    window.location.reload();
  }
  archiveMessages(){
    this.selectedMessages.forEach(message => this.firestore.archiveMsg(message));
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  }
  selectMessage(msg: Message){
    let alreadyPush = this.checkIfSelected(msg);
    console.log(alreadyPush);

    if(alreadyPush == -1) this.selectedMessages.push(msg)
    else this.selectedMessages.splice(alreadyPush);

    console.log(this.selectedMessages);
  }

  checkIfSelected(msg: Message){
    let alreadyPush = -1;
    if(this.selectedMessages.length > 0)
    for (let i=0; i < this.selectedMessages.length; i++){
      if(this.selectedMessages[i].objectID == msg.objectID) alreadyPush = i;
    }
    return alreadyPush;
  }
  
}
