import { Component, OnInit } from '@angular/core';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Message } from '../../../models/message/message.model';
import { ArrayType } from '@angular/compiler';
import { Title } from '@angular/platform-browser';




@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})



export class InboxComponent implements OnInit {
  type: string;
  msgId: string;
  actualUserId = JSON.parse(localStorage.getItem("user")).id;
  messageUserId: string;
  userData: {};
  avatar: string;
  messagesData: {};
  messageData: {};
  selectedMessages: Message [] = [];
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private _route: ActivatedRoute, private algolia: AlgoliaService, private firestore: FirestoreService,private titleService: Title) {}
  
  ngOnInit() {
    
    this.type = this._route.snapshot.queryParams['type'];
    this.msgId = this._route.snapshot.queryParams['msg'];
    this.getMessagesData();
    
  }
  

  async getMessagesData(){
    
    if(this.type){
      
    switch(this.type){
      case "sent": this.messagesData = await this.algolia.getSentMessages();this.titleService.setTitle( "Mensajes enviados" );break;
      case "received": this.messagesData = await this.algolia.getReceivedMessages();this.titleService.setTitle( "Buzón" );break;
      case "archived": this.messagesData = await this.algolia.getArchivedMessages();this.titleService.setTitle( "Mensajes archivados" );break;
    }
  }
    else{ 
      this.messageData = await this.algolia.getMessageById(this.msgId);
      if(this.messageData)
        this.firestore.openMsg(this.messageData);
      this.userData = await this.algolia.getUserById(this.messageData['from_id'])
      this.messageUserId = this.userData["objectID"];
      if(this.userData['avatar'] !== "no-avatar.png")
        this.avatar = "url("+this.userData['avatar']+")";
      else
        this.avatar = "url('../../../assets/img/no-avatar.png')";
        }
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

    if(alreadyPush == -1) this.selectedMessages.push(msg)
    else this.selectedMessages.splice(alreadyPush, 1);

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
