import { Component, OnInit, createPlatformFactory } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { AlgoliaService } from '../../../services/algolia/algolia.service';

import countriesJSON from '../../../json/countries-and-states.json';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})


export class EditProfileComponent implements OnInit {
  countries = countriesJSON.countries;
  actualUserID: string;
  editProfileForm: FormGroup;
  userInfo: {};
  
  constructor(private algolia: AlgoliaService, private fb: FormBuilder, private firestore: FirestoreService) { }
 

  ngOnInit() {
    
    this.getData();
    
  }
  async getData(){
    this.createForm();

    this.actualUserID = JSON.parse(localStorage.getItem('user')).id;
    this.userInfo = await this.algolia.getUserById(this.actualUserID);
  
    
  }
  createForm(){
    this.editProfileForm = this.fb.group({
      name:[''],
      state: [''],
      country: [''],
      description: [''],
    });
  }
  updateUser(user){
    this.firestore.updateUser(this.actualUserID, user);
  }
}
