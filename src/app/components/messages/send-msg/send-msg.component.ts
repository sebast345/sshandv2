import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlgoliaService } from "../../../services/algolia/algolia.service";

export const ESmonths = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ]
@Component({
  selector: 'app-send-msg',
  templateUrl: './send-msg.component.html',
  styleUrls: ['./send-msg.component.css']
})
export class SendMsgComponent implements OnInit {
  msgID: string;
  useremail: string;
  msgInfo: {};
  subject: "";
  messageForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private _route: ActivatedRoute,
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private algolia: AlgoliaService) { 
    }

  ngOnInit() {
    this.msgID = this._route.snapshot.queryParams['msg'];
    this.useremail = this._route.snapshot.queryParams['e'];
    this.getData();
    
  }

  createForm() {
    if(this.msgInfo){
      this.messageForm = this.fb.group({
        to_id: [this.useremail],
        subject: [this.msgInfo["subject"]],
        message: ['',[Validators.required, Validators.minLength(30), Validators.maxLength(500)]],
        recipientDelete: ['0'],
        senderDelete: ['0'],
        archived: ['0'],
        timestamp: ['0'],
        opened: ['0']
      });
    }else{
      this.messageForm = this.fb.group({
        to_id: ['',[ Validators.required, Validators.email]],
        subject: ['',[Validators.required, Validators.minLength(20), Validators.maxLength(150)]],
        message: ['',[Validators.required, Validators.minLength(30), Validators.maxLength(500)]],
        recipientDelete: ['0'],
        senderDelete: ['0'],
        archived: ['0'],
        timestamp: ['0'],
        opened: ['0']
      });
    }
    
  }
  async getData(){
    this.msgInfo = await this.algolia.getMessageById(this.msgID);
    this.createForm();
  }
  sendMessage(value){
    var today = new Date();
    var date = today.getDate()+' de '+ESmonths[(today.getMonth())];
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date+' '+time;
    value.timestamp = today;
    value.date = dateTime;
    this.fireservice.sendMsg(value);
    window.location.href = './inbox?type=sent';
  }
}
