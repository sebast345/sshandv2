import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { UploadService } from  '../../../services/upload/upload.service';
import { ESmonths } from '../../messages/send-msg/send-msg.component';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  toMain = [];
  categories = [
    "Moda",
    "Videojuegos",
    "Juguetes",
    "Comida",
    "Salud",
    "Coche y moto",
    "Inmuebles"
  ]
  photos = [];
  postForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = [];  
  constructor(
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private uploadService: UploadService) { }

  ngOnInit() {
    this.setListener();
    this.createForm();
  }

  createForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(25), Validators.maxLength(150), Validators.pattern(new RegExp(/^[A-Za-z0-9\s]+$/))]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      category: ['',Validators.required],
      price: ['', [Validators.pattern(new RegExp(/^[0-9]+(\.[0-9]{2})?$/)), Validators.required]],
      photos: ['["no-image.jpg"]'],
      main_photo: ['["no-image.jpg"]']
    });
  }

  postItem(value){
    setTimeout(() => {
      if(this.photos.length > 0){
        value.photos = JSON.stringify(this.photos);
        if(this.toMain.length > 0)
          value.main_photo = this.toMain[0];
        else
          value.main_photo = this.photos[0];
      }

      value.price = this.toFloat(value.price);

      if(this.checkIfUploading()) {
        this.errorMessage = "Esperando a que se suban todas las fotos...";
        this.successMessage = "";
        this.postItem(value);
      }
      else{
        
        var today = new Date();
        var date = today.getDate()+' de '+ESmonths[(today.getMonth())];
        var time = today.getHours() + ":" + today.getMinutes();
        var dateTime = date+' '+time;
        value.timestamp = today;
        value.date = dateTime;
        this.fireservice.postItem(value);
        this.successMessage = "Has posteado tu item correctamente";
        this.errorMessage = "";
      } 
    }, 500);
    
  }


  async uploadFiles() {  
    this.fileUpload.nativeElement.value = ''; 
    for (const file of this.files) {
      if(!file.uploaded){
        this.photos.push(await this.uploadService.upload(file));
        file.uploaded = true;
      }  
    } 
  }
  removeFile(filename: string){
    this.files.splice(this.files.indexOf(filename), 1);
  }
  setListener() {
    setTimeout(() => {
      if(!this.fileUpload.nativeElement)
        this.setListener();
      const fileUpload = this.fileUpload.nativeElement;
      fileUpload.onchange = () => {  
        for (let i = 0; i < fileUpload.files.length; i++)  {  
          const file = fileUpload.files[i];  
          this.files.push({ data: file, uploaded: false});  
        } 
      }; 
    }, 500);   
  }
  private checkIfUploading(){
    let uploaded = 0;
    for(let i=0;i < this.files.length; i++){
      if(this.files[i].uploaded)
        uploaded++;
      
        console.log(this.files[i].uploaded);
    }
    if(uploaded == this.files.length)
      return false;
    else
      return true;
  }
  selectImage(img){

    if(this.toMain.length > 0)
      this.toMain.splice(0);

    this.toMain.push(img);
         
  }

  private toFloat(number){
    <string> <unknown>number.replace(',', '.');
    return parseFloat(number);
  }
    

}
