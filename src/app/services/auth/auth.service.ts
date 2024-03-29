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
    if(localStorage.getItem('user') !== null){
      this.loggedUserID = JSON.parse(localStorage.getItem('user')).id;
    }
    this.setUserLocalStorage();
  }
  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.addScope('https://www.googleapis.com/auth/user.birthday.read');
      provider.addScope('https://www.googleapis.com/auth/user.gender.read');
      firebase.auth
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
        
      }, err => reject(err))
    })
  }
  login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
        this.setUserLocalStorage();
      }, err => reject(err))
    })
    
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
              "id": doc.id,
              "emailVerified": logintoken.emailVerified,
              "provider":logintoken.providerData[0].providerId
            };
            localStorage.setItem('user', JSON.stringify(user));
          });
        });

        
      } else {
        localStorage.removeItem('user');
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
    window.location.href = '/login-register';
    
    
  }
  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }
  get isVerified(): boolean {
    const  verified  =  JSON.parse(localStorage.getItem('user')).emailVerified;
    return  verified;
  }
  get isGoogleLogged(): boolean {
    const  provider  =  JSON.parse(localStorage.getItem('user')).provider;
    return  provider  ==  "google.com";
  }

  
  confirmPasswordReset(code, password){
    this.afAuth.auth
    .confirmPasswordReset(code, password)
    .then(() => this.router.navigate(['login-register']))
    .catch(err => {
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
  deleteUser(){
    var user = firebase.auth().currentUser;

    user.delete();
  }
}

