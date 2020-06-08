import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { reloadPage } from '../../inicio/inicio.component';
import { UploadService } from 'src/app/services/upload/upload.service';



@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.css']
})
export class ChangeAvatarComponent implements OnInit {
  avatarForm: FormGroup;
  uploaded: boolean;
  avatar = [];
  alerts: any[] = [];
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  constructor(
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private uploadService: UploadService) { }

  ngOnInit() {
    
    this.createForm();
    this.setListener();
  }
  createForm() {
    this.avatarForm = this.fb.group({
      avatar: ['',Validators.required]
    });
  }

  setListener() {
    setTimeout(() => {
      if(!this.fileUpload.nativeElement)
        this.setListener();
      const fileUpload = this.fileUpload.nativeElement;
      fileUpload.onchange = () => {  
        for (let i = 0; i < fileUpload.files.length; i++)  {  
          const file = fileUpload.files[i];  
          this.avatar.push({ data: file, uploaded: false});  
          console.log(this.avatar);
        } 
      }; 
    }, 500);   
  }
  async updateAvatar(value) {  
    this.fileUpload.nativeElement.value = ''; 
    value.avatar = await this.uploadService.upload(this.avatar[0]);
    this.fireservice.updateAvatar(value);
    this.alerts.push({
      type: 'success',
      msg: `Avatar actualizado, recargando página...`,
      timeout: 200
    });
  }
  onClose(){
    reloadPage();
  }
}
