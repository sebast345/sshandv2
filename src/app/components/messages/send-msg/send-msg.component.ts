import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-send-msg',
  templateUrl: './send-msg.component.html',
  styleUrls: ['./send-msg.component.css']
})
export class SendMsgComponent implements OnInit {
  public msgID: string;
  
  ESmonths = [
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
  messageForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private router: Router,
    private fb: FormBuilder,
    private fireservice: FirestoreService) { 
    }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.messageForm = this.fb.group({
      to_id: ['', Validators.required ],
      subject: ['',Validators.required],
      message: ['',Validators.required],
      recipientDelete: ['0'],
      senderDelete: ['0'],
      archived: ['0'],
      timestamp: ['0'],
      opened: ['0']
    });
  }

  sendMessage(value){
    var today = new Date();
    var date = today.getDate()+' de '+this.ESmonths[(today.getMonth())];
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date+' '+time;

    value.timestamp = dateTime;
    this.fireservice.sendMsg(value);
  }
}
