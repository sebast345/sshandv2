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
    "Comida"
  ]
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
      this.postForm.value.photo = filename;
      this.postItem(this.postForm.value);
    };
    
    this.createForm();
  }

  createForm() {
    this.postForm = this.fb.group({
      title: ['', Validators.required ],
      description: ['',Validators.required],
      category: ['',Validators.required],
      price: ['',Validators.required],
      photo: ['',Validators.required],
    });
  }

  postItem(value){
    this.fireservice.postItem(value);
  }
}
