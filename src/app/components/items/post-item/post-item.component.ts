import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { UploadService } from  '../../../services/upload/upload.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/services/shared/shared.service';
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
  alerts: any[] = [];

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = [];  
  constructor(
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private uploadService: UploadService,
    private titleService: Title,
    private auth: AuthService,
    private shared: SharedService) { }

  ngOnInit() {
    this.titleService.setTitle( "Publicar un artículo" );
    if(this.auth.isLoggedIn){
      this.setListener();
      this.createForm();
    }
    else  
      this.shared.openNotLoggedDialog();
    
  }

  createForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(25), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      category: ['',Validators.required],
      price: ['', [Validators.pattern(new RegExp(/^[0-9]+(\.[0-9]{2})?$/)), Validators.required]],
      photos: ['["no-image.jpg"]'],
      main_photo: ['no-image.jpg']
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
        this.alerts.push({
          type: 'info',
          msg: `Esperando a que se suban todas las fotos...`,
          timeout: 2000,
          error: true,
        });
        setTimeout(() => {
          this.postItem(value);
        }, 2000);
        
      }
      else{
        this.fireservice.postItem(value);
        this.alerts.push({
          type: 'success',
          msg: `Has publicado tu artículo correctamente`,
          timeout: 3000,
          error: false,
        });

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
    
  onClose(error){
    if(!error)
      window.location.href = './for-sale';
  }

}
