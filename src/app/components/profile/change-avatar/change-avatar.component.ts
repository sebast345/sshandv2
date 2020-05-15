import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';


const URL = 'http://localhost:4000/api/upload';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent implements OnInit {
  avatarForm: FormGroup;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });
  constructor(
    private fb: FormBuilder,
    private fireservice: FirestoreService) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log(response);
      var filename = JSON.parse(response).filename;
      this.avatarForm.value.avatar = filename;
      this.updateAvatar(this.avatarForm.value);
    };
    
    this.createForm();
  }
  createForm() {
    this.avatarForm = this.fb.group({
      avatar: ['',Validators.required]
    });
  }

  updateAvatar(value){
    this.fireservice.updateAvatar(value);
  }
}
