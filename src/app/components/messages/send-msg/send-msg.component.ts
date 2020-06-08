import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlgoliaService } from "../../../services/algolia/algolia.service";
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-send-msg',
  templateUrl: './send-msg.component.html',
  styleUrls: ['./send-msg.component.css']
})
export class SendMsgComponent implements OnInit {
  itemID: string;
  useremail: string;
  itemInfo: {};
  msgInfo: {};
  subject: any;
  msgID: string;
  alerts: any[] = [];
  messageForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private _route: ActivatedRoute,
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private algolia: AlgoliaService,
    private titleService: Title) { 
    }

  ngOnInit() {
    this.titleService.setTitle( "Enviar un mensaje privado" );
    this.getData();
    this.createForm();
 
  }

  createForm() {
    this.messageForm = this.fb.group({
      to_email: ['',[ Validators.required, Validators.email]],
      subject: ['',[Validators.required, Validators.maxLength(150)]],
      message: ['',[Validators.required, Validators.maxLength(500)]],
      recipientDelete: ['0'],
      senderDelete: ['0'],
      archived: ['0'],
      timestamp: ['0'],
      opened: ['0']
    });  
  }
  updateForm(){
    if(this.useremail && !this.subject){
      this.messageForm = this.fb.group({
        to_email: [this.useremail],
        subject: ['', [Validators.required, Validators.maxLength(150)]],
        message: ['',[Validators.required, Validators.maxLength(500)]],
        recipientDelete: ['0'],
        senderDelete: ['0'],
        archived: ['0'],
        timestamp: ['0'],
        opened: ['0']
      });
    }
    else if(this.subject && this.useremail)
      this.messageForm = this.fb.group({
        to_email: [this.useremail],
        subject: ['RE:'+this.subject],
        message: ['',[Validators.required, Validators.maxLength(500)]],
        recipientDelete: ['0'],
        senderDelete: ['0'],
        archived: ['0'],
        timestamp: ['0'],
        opened: ['0']
      });
  }
  async getData(){
    this.itemID = this._route.snapshot.queryParams['i'];
    this.msgID = this._route.snapshot.queryParams['msg'];
    this.useremail = this._route.snapshot.queryParams['e']; 
    
    if(this.itemID){
      this.itemInfo = await this.algolia.getItemById(this.itemID);
      this.subject = this.itemInfo['title'];
    }
    else{
      this.subject = false;
    }
    if(this.msgID){
      this.msgInfo = await this.algolia.getMessageById(this.msgID);
      this.subject = this.msgInfo['subject'];
    }else
     this.subject = false;

    this.updateForm();
    
  }
  async sendMessage(value){
    let emailExists = await this.algolia.checkIfEmailExists(value.to_email);
    if(!emailExists)
      this.alerts.push({
        type: 'danger',
        msg: `Ese email no está vinculado a ningún usuario`,
        timeout: 2000,
        error: true,
      });
    else if(value.to_email !== JSON.parse(localStorage.getItem('user')).email){
      this.fireservice.sendMsg(value);
      this.alerts.push({
        type: 'success',
        msg: `Mensaje enviado, serás redirigido...`,
        timeout: 2000,
        error: false
      });
    }
    else
      this.alerts.push({
        type: 'danger',
        msg: `No puedes enviarte mensajes a ti mismo`,
        timeout: 2000,
        error: true,
      });
    
  }
  onClose(error){
    if(!error)
      window.location.href = './inbox?type=sent';
  }
}
