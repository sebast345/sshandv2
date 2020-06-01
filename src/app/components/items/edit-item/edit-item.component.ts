import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { AlgoliaService } from '../../../services/algolia/algolia.service';

const URL = 'http://localhost:4000/api/upload';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

  itemInfo: {};
  itemID: string;

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
  actualPhotos = [];
  toDelete = [];
  toMain = [];

  editItemForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router,
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private _route: ActivatedRoute,
    private algolia: AlgoliaService) { }

  ngOnInit() {
    this.getData();
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

      var filename = JSON.parse(response).filename;
      
      this.photos.push(filename);
      
    };
  }
  async getData(){
    this.itemID = this._route.snapshot.queryParams['i'];
    this.itemInfo = await this.algolia.getItemById(this.itemID);
    console.log(this.itemInfo);
    this.actualPhotos = JSON.parse(this.itemInfo['photos']);
    this.createForm();

  }
  createForm() {
    this.editItemForm = this.fb.group({
      title: [this.itemInfo['title'], [Validators.minLength(25), Validators.maxLength(150)]],
      description: [this.itemInfo['cescription'], [, Validators.minLength(50), Validators.maxLength(500)]],
      category: [this.itemInfo['category']],
      price: [this.itemInfo['price'], Validators.pattern("^[0-9]+(\.[0-9]{2})?$")],
      photos: [this.itemInfo['photos']],
      main_photo: [this.itemInfo['main_photo']]
    });
  }
  updateItem(value){
    setTimeout(() => {
      this.updatePhotos();
    if(this.actualPhotos.length > 0){

      value.photos = JSON.stringify(this.actualPhotos);
      if(this.toMain.length > 0)
        value.main_photo = this.toMain[0];
    }
    else{
      value.photos = JSON.stringify(["no-image.jpg"]);
      value.main_photo = "no-image.jpg";
    }
    value.objectID = this.itemID;
    console.log(value.objectID);
    if(this.uploader.isUploading) this.updateItem(value);
    else this.fireservice.updateItem(value);
    }, 500);
    
  }

  selectImage(img, type){
    switch(type){
      case "delete":
        let alreadyPush = this.checkIfSelected(img);
        console.log(alreadyPush);

        if(alreadyPush == -1) this.toDelete.push(img)
        else this.toDelete.splice(alreadyPush);

        ;break;
      case "main":
        if(this.toMain.length > 0)
          this.toMain.splice(0);

        this.toMain.push(img);
        
        ;break;
    }
        
  }
    

  checkIfSelected(img){
    let alreadyPush = -1;
    if(this.toDelete.length > 0)
    for (let i=0; i < this.toDelete.length; i++){
      if(this.toDelete[i] == img) alreadyPush = i;
    }
      return alreadyPush;
  }
  updatePhotos(){
    for(let i=0;i < this.toDelete.length; i++){
      this.actualPhotos.splice(this.actualPhotos.indexOf(this.toDelete[i]));
    }
    
    this.actualPhotos.concat(this.photos);
  }

}
