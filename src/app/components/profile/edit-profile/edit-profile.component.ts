import { Component, OnInit} from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { AlgoliaService } from '../../../services/algolia/algolia.service';
import { SharedService } from '../../../services/shared/shared.service';
import countriesAndStates from '../../../json/countries-and-states.json';
import { reloadPage } from '../../inicio/inicio.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})


export class EditProfileComponent implements OnInit {
  countriesAndStates = countriesAndStates;
  actualUserID: string;
  editProfileForm: FormGroup;
  userInfo: {};
  alerts: any[] = [];
  constructor(private algolia: AlgoliaService,
     private fb: FormBuilder, 
     private firestore: FirestoreService, 
     private shared: SharedService,
     private auth: AuthService,
     private titleService: Title) { }
 

  ngOnInit() {
    this.titleService.setTitle( "Editar mi perfil" );
    if(this.auth.isLoggedIn)
      this.getData();
    else  
      this.shared.openNotLoggedDialog();

    
  }
  async getData(){
    this.actualUserID = JSON.parse(localStorage.getItem('user')).id;
    this.userInfo = await this.algolia.getUserById(this.actualUserID);
    this.createForm();
    this.shared.setStatesListener();
    
  
    
  }
  createForm(){
    this.editProfileForm = this.fb.group({
      name:[this.userInfo['name'], [Validators.minLength(5), Validators.maxLength(30), Validators.pattern(new RegExp(/([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)\s([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)/))]],
      state: [this.userInfo['country']],
      country: [this.userInfo['state']],
      description: [this.userInfo['description'], Validators.maxLength(250)],
    });
  }
  updateUser(user){
    this.firestore.updateUser(this.actualUserID, user);
    this.alerts.push({
      type: 'success',
      msg: `Perfil actualizado, recargando página...`,
      timeout: 2000
    });
  }
  onClose(){
    reloadPage();
  }
  
}
