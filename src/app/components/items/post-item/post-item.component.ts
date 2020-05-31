import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';

const URL = 'http://localhost:4000/api/upload';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  title = 'ng8fileupload';
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

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
  constructor(private router: Router,
    private fb: FormBuilder,
    private fireservice: FirestoreService) { }

  ngOnInit() {
    this.createForm();
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

      var filename = JSON.parse(response).filename;
      
      this.photos.push(filename);
      
    };
    
    
    
  }

  createForm() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(25), Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      category: ['',Validators.required],
      price: ['', [Validators.pattern("^[0-9]+(\.[0-9]{2})?$"), Validators.required]],
      photos: ['no-image.jpg'],
      main_photo: ['no-image.jpg']
    });
  }

  postItem(value){
    setTimeout(() => {
    if(this.photos.length > 0){
      value.photos = JSON.stringify(this.photos);
      value.main_photo = this.photos[0];
    }
    if(this.uploader.isUploading) this.postItem(value);
    else this.fireservice.postItem(value);
    }, 500);
    
  }
}
