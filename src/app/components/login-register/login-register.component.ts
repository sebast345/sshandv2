import { Component, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { HttpClient } from '@angular/common/http';

import countriesAndStates from '../../json/countries-and-states.json';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;
  registerError: string = '';
  registerSuccess: string = '';
  loginError: string = '';
  loginSuccess: string = '';
  successMessage: string = '';
  maxDate = new Date();
  minDate = new Date();
  countriesAndStates = countriesAndStates;
  countries = [];
  states = [];

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private fireservice: FirestoreService,
     private http: HttpClient
  ) {
    if(!this.authService.isLoggedIn){

    }
    this.setDates();
    this.createRegisterForm();
    this.createLoginForm();
    this.setStatesListener();
    
   }

   createRegisterForm() {
     this.registerForm = this.fb.group({
       name:['', [Validators.required, Validators.maxLength(30), Validators.pattern(new RegExp(/([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)\s([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)/))]],
       email: ['', Validators.required ],
       password: ['',[Validators.required, Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]/)), Validators.maxLength(24), Validators.minLength(8)]],
       repassword: ['',[Validators.required, Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]/)), Validators.maxLength(24), Validators.minLength(8)]],
       age: ['',Validators.required],
       state: ['Algún sitio',Validators.required],
       country: ['Alguna parte',Validators.required],
       avatar: ["no-avatar.png"],
       description: ['']
     });
   }
   createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['',Validators.required]
    });
  }

   tryGoogleLogin(){
     let birthdate;
     this.authService.doGoogleLogin()
     .then(res =>{
       console.log(res);
      let userInfo;
      if(res.additionalUserInfo.isNewUser){
          userInfo = {
            name: res.additionalUserInfo.profile.name,
            email: res.additionalUserInfo.profile.email,
            avatar: res.additionalUserInfo.profile.picture,
            gender: "",
            age: ""
          }
          this.http
          .get("https://people.googleapis.com/v1/people/"+res.additionalUserInfo.profile['id']+"?key=AIzaSyAkf7s6jufCG2a9BS6rb6mS_3G56I-ZBF0&personFields=birthdays,genders&access_token="+res.credential['accessToken'])
          .subscribe((res: any) => {
            if(res.genders && (res.genders[0].value !== "male" || res.genders[0].value !== "female"))
              userInfo.gender = res.genders[0].value;
            userInfo.age = res.birthdays[0].date.year+"-"+res.birthdays[0].date.month+"-"+res.birthdays[0].date.day;

            birthdate = new Date(userInfo.age);
            if(birthdate > this.maxDate){
              this.authService.deleteUser();
              this.loginError = "Lo sentimos, siendo menor no puedes acceder a esta web.";
              this.loginSuccess = "";
            }
            else{
              this.fireservice.createUser(userInfo);
              this.loginError = "";
              this.loginSuccess = "Has iniciado sesión, ahora serás redireccionado";
            }
              
          });

        }
        
     }, err => {
        console.log(err);
        this.loginError = "Algo raro ha pasado, intentalo de nuevo más tarde.";
        this.loginSuccess = "";
     }
     )
   }

   tryRegister(value){
     if(value.password == value.repassword){

      this.authService.doRegister(value)
      .then(res => {
        console.log(res);
        delete value.password;
        delete value.repassword;
        this.fireservice.createUser(value);
        this.registerError = "";
        this.registerSuccess = "Cuenta creada, ahora serás redireccionado";
      }, err => {
        console.log(err);
        switch(err.code){
          case "auth/email-already-in-use": this.registerError = "Ese email ya está en uso.";break;
          case "auth/email-already-exists": this.registerError = "Ese email ya está en uso.";break;
          default: this.registerError = "Algo raro ha pasado, intentalo de nuevo más tarde";break;
        }
        this.registerSuccess = "";
      })
    }else{
        this.registerError = "Las contraseñas deben ser iguales";
        this.registerSuccess = "";
    }
   }
   tryLogin(value){
    this.authService.login(value.email, value.password)
    .then(res => {
      this.loginError = "";
      this.loginSuccess = "Has iniciado sesión, ahora serás redireccionado";
    }, err => {
      console.log(err);
      switch(err.code){
        case "auth/wrong-password": this.loginError = "Contraseña incorrecta, intentalo de nuevo.";break;
        case "auth/invalid-email": this.loginError = "Ese email no existe.";break;
        default: this.loginError = "Algo raro ha pasado, intentalo de nuevo más tarde.";break;
      }
      this.loginSuccess = "";
    })
   }
   setDates(){
    this.maxDate.setFullYear( this.maxDate.getFullYear() - 18);
    this.minDate.setFullYear( this.maxDate.getFullYear() - 120);
    
   }
   setStatesListener(){
    setTimeout(() => {
      let stateLabel = document.getElementById("stateLabel");
      let countrySel = <HTMLSelectElement>document.getElementById("countrySel");
      if(!countrySel)
        this.setStatesListener();
      let stateSel = <HTMLSelectElement>document.getElementById("stateSel");
      //Cambiar las ciudades en cuanto cambie de pais el Select
      countrySel.addEventListener("change",() => {
          if(countrySel.value == "Alguna parte"){
            stateSel.length = 0;
            stateSel.options[stateSel.options.length] = new Option("--Selecciona provincia--", "Algún sitio");
            stateLabel.style.display = "none";
            return;
          }
            
          for (var i = 0; i < countriesAndStates['countries'].length; i++) {
            if(countriesAndStates['countries'][i].country == countrySel.value) var country = i;
          }
          stateSel.length = 0; // Primero quitar todas las opciones actuales
    
          if (countrySel.selectedIndex < 1)
              return; // done
    
          var states = countriesAndStates['countries'][country].states;
          
          if(states.length == 0)
            stateSel.options[stateSel.options.length] = new Option(countrySel.value, countrySel.value);
          else
            for (var j = 0; j < states.length; j++) {
                stateSel.options[stateSel.options.length] = new Option(states[j], states[j]);
            }
            stateLabel.style.display = "block";
 
      })
    }, 200);
   }



}