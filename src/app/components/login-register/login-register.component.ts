import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore/firestore.service';

import countriesJSON from '../../json/countries-and-states.json';

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
  countries = countriesJSON.countries;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private fireservice: FirestoreService
  ) {
    if(!this.authService.isLoggedIn){

    }
    this.createRegisterForm();
    this.createLoginForm();
    
   }

   createRegisterForm() {
     this.registerForm = this.fb.group({
       name:['', Validators.required],
       email: ['', Validators.required ],
       password: ['',Validators.required],
       repassword: ['',Validators.required],
       age: ['',Validators.required],
       state: ['',Validators.required],
       country: ['',Validators.required],
       avatar: ["no-avatar.png"],
       description: ['']
     });
   }
   createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['',Validators.required]
    });
  }

   tryGoogleLogin(){
     this.authService.doGoogleLogin()
     .then(res =>{
        console.log(res);
        this.loginError = "";
        this.loginSuccess = "Has iniciado sesión, ahora serás redireccionado";
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



}