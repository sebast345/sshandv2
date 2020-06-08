import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
import { UploadService } from  '../../../services/upload/upload.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

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
  toDelete = [];
  toMain = [];

  editItemForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files  = []; 
  alerts: any[] = [];
  constructor(private router: Router,
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private _route: ActivatedRoute,
    private algolia: AlgoliaService,
    private uploadService: UploadService,
    private titleService: Title) { }

  ngOnInit() {
    this.setListener();
    this.getData();
  }
  async getData(){
    this.itemID = this._route.snapshot.queryParams['i'];
    this.itemInfo = await this.algolia.getItemById(this.itemID);
    this.titleService.setTitle( "Editando "+this.itemInfo['title'] );

    this.photos = JSON.parse(this.itemInfo['photos']);
    console.log(this.photos);
    this.createForm();

  }
  createForm() {
    this.editItemForm = this.fb.group({
      title: [this.itemInfo['title'], [Validators.minLength(25), Validators.maxLength(150), Validators.pattern(new RegExp(/^[A-Za-z0-9\s]+$/))]],
      description: [this.itemInfo['description'], [, Validators.minLength(50), Validators.maxLength(500)]],
      category: [this.itemInfo['category']],
      price: [this.itemInfo['price'], Validators.pattern(new RegExp(/^[0-9]+(\.[0-9]{2})?$/))],
      photos: [this.itemInfo['photos']],
      main_photo: [this.itemInfo['main_photo']]
    });
  }
  updateItem(value){

    setTimeout(() => {
      
      this.updatePhotos();
      if(this.photos.length > 0){
        value.photos = JSON.stringify(this.photos);
        if(this.toMain.length > 0)
          value.main_photo = this.toMain[0];
        else
          value.main_photo = this.photos[0];
      }

      if(this.checkIfUploading()) {
        this.alerts.push({
          type: 'info',
          msg: `Esperando a que se suban todas las fotos...`,
          timeout: 2000,
          error: true,
        });
        
        this.updateItem(value);
      }
      else{
        this.alerts.push({
          type: 'success',
          msg: `Has publicado tu artículo correctamente`,
          timeout: 3000,
          error: false,
        });
        value.objectID = this.itemID;
        this.fireservice.updateItem(value);
      } 
    }, 500);
    
  }

  selectImage(img, type){
    switch(type){
      case "delete":
        let alreadyPush = this.checkIfSelected(img);
        console.log(alreadyPush);

        if(alreadyPush == -1) this.toDelete.push(img)
        else this.toDelete.splice(alreadyPush, 1);
        ;break;
      case "main":
        if(this.toMain.length > 0)
          this.toMain.splice(0);

        this.toMain.push(img);
        
        ;break;
    }
        
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
      this.photos.splice(this.photos.indexOf(this.toDelete[i]), 1);
    }
  }
  onClose(error){
    if(!error)
      window.location.href = './for-sale';
  }

}
