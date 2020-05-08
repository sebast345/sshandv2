import { Component, OnInit } from '@angular/core';
import { searchClient } from '../../../services/algolia/algolia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service'
// import * as TableJS from "../../js/TableJS.js";




@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})



export class InboxComponent implements OnInit {
  messagesForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private fireservice: FirestoreService) {
    
   }
  
  ngOnInit() {
    // TableJS.setMessagesTables(searchClient);
    this.createForm();
  }
  
  createForm() {
    this.messagesForm = this.fb.group({
      selectedMessages: ['']
    });
  }

  console(value){

      console.log(value);

    
  }
  getArchivedMessages(){

  }
  getInMessages(){
    
  }
  getOutMessages(){

  }
  deleteMessage(){

  }
  archiveMessage(){

  }
  checkForFullMsgDelete(){

  }
  
}
