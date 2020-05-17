import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { ThrowStmt } from '@angular/compiler';

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
    "Comida"
  ]
  photos = [];
  postForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private router: Router,
    private fb: FormBuilder,
    private fireservice: FirestoreService) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

      var filename = JSON.parse(response).filename;
      
      this.photos.push(filename);
      
    };
    
    this.createForm();
  }

  createForm() {
    this.postForm = this.fb.group({
      title: ['', Validators.required ],
      description: ['',Validators.required],
      category: ['',Validators.required],
      price: ['',Validators.required],
      photos: ['no-image.jpg'],
      main_photo: ['no-image.jpg']
    });
  }

  postItem(value){
    setTimeout(() => {
      console.log(this.photos.length);
    if(this.photos.length > 0){
      
      value.photos = JSON.stringify(this.photos);
      value.main_photo = JSON.stringify(this.photos[0]);
    }
    
    this.fireservice.postItem(value);
    }, 5000);
    
  }
}
