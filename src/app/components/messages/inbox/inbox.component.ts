import { Component, OnInit } from '@angular/core';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Message } from '../../../models/message/message.model';
import { ArrayType } from '@angular/compiler';




@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})



export class InboxComponent implements OnInit {
  type: string;
  msgId: string;
  messagesData: {};
  messageData: {};
  selectedMessages: Message [] = [];
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService, private firestore: FirestoreService) {}
  
  ngOnInit() {
    this.type = this._route.snapshot.queryParams['type'];
    this.msgId = this._route.snapshot.queryParams['msg'];
    this.getMessagesData();
    
  }
  

  async getMessagesData(){
    
    if(this.type){
      
    switch(this.type){
      case "sent": this.messagesData = await this.algolia.getSentMessages();break;
      case "received": this.messagesData = await this.algolia.getReceivedMessages();break;
      case "archived": this.messagesData = await this.algolia.getArchivedMessages();break;
    }
  }
    else this.messageData = await this.algolia.getMessageById(this.msgId);
  }

  deleteMessages(){
    var itemsProcessed = 0;
    this.selectedMessages.forEach((message, index, array) => {
      this.firestore.deleteMsg(message, this.type); 
      itemsProcessed++;
      if(itemsProcessed === array.length){
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        
      }
    });
    
  }
  archiveMessages(){
    var itemsProcessed = 0;
    this.selectedMessages.forEach((message, index, array) => {
      this.firestore.archiveMsg(message); 
      itemsProcessed++;
      if(itemsProcessed === array.length){ 
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        
      }
    });

    
  }
  checkopened(number: number){
    if(number == 1){
      return false;
    }else{
      return true;
    }
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
