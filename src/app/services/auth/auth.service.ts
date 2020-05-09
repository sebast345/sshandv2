import { Injectable } from '@angular/core';

import { Router } from  "@angular/router";

import { AngularFireAuth } from  "@angular/fire/auth";
import { FirestoreService } from '../../services/firestore/firestore.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedUserID: string;
  constructor( public  afAuth:  AngularFireAuth, public  router:  Router, private fireservice: FirestoreService) { 
    if(localStorage.getItem('user') != null){
      this.loggedUserID = JSON.parse(localStorage.getItem('user')).id;
    }
    this.setUserLocalStorage();
  }
  
  async login(email: string, password: string) {
    await this.afAuth.auth.signInWithEmailAndPassword(email, password)
    await this.setUserLocalStorage();

    setTimeout(() => {
      this.router.navigate(['user-profile/'+ this.loggedUserID]);
    }, 3000);
    
  } 
  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
        this.sendEmailVerification();
      }, err => reject(err))
    })
  }
  setUserLocalStorage(){
     this.afAuth.authState.subscribe(logintoken => {
      if (logintoken){
        let user_collection = this.fireservice.firestore.collection("user-profiles");
        let query = user_collection.ref.where("email", "==", logintoken.email).get();

       query.then( function ( querySnapshot ) {
          querySnapshot.forEach( function ( doc ){
            let user = {
              "name": doc.data().name,
              "email": doc.data().email,
              "id": doc.id
            };
            localStorage.setItem('user', JSON.stringify(user));
          });
        });

        
      } else {
        localStorage.setItem('user', null);
      }
    })
  }
  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
    this.router.navigate(['login-register']);
  }
  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }
  async logout(){
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login-register']);
  }
  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }
  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      })
    })
  }
  confirmPasswordReset(code, password){
    this.afAuth.auth
    .confirmPasswordReset(code, password)
    .then(() => this.router.navigate(['login-register']))
    .catch(err => {
      console.log(err.code);
    })
  }
  verifyEmail(code){
    this.afAuth.auth
    .applyActionCode(code)
    .then(() => {
      this.router.navigate(['user-profile/'+this.loggedUserID])
    })
    .catch(err => {
      return "Es posible que el link esté expirado o tu correo ya esté verificado."
    });
  }
}

