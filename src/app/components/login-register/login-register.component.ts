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
  errorMessage: string = '';
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
       this.router.navigate(['/user']);
     }, err => console.log(err)
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
        this.errorMessage = "";
        this.successMessage = "Cuenta creada";
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
    }else{
        this.errorMessage = "Las contraseñas deben ser iguales";
        this.successMessage = "";
    }
   }
   tryLogin(value){
    this.authService.login(value.email, value.password);
   }



}