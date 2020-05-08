import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';

import { FileSelectDirective } from 'ng2-file-upload';

import { FormsModule } from '@angular/forms';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import { NgAisModule } from 'angular-instantsearch';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { UserProfileComponent } from './components/profile/user-profile/user-profile.component';
import { PostItemComponent } from './components/items/post-item/post-item.component';
import { InboxComponent } from './components/messages/inbox/inbox.component';
import { SendMsgComponent } from './components/messages/send-msg/send-msg.component';
import { ViewMessageComponent } from './components/messages/view-message/view-message.component';
import { ItemviewComponent } from './components/items/itemview/itemview.component';
import { AuthComponent } from './components/authentification/auth/auth.component';
import { ConfirmPasswordResetComponent } from './components/authentification/confirm-password-reset/confirm-password-reset.component';
import { ConfirmEmailAddressComponent } from './components/authentification/confirm-email-address/confirm-email-address.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { SendReviewComponent } from './components/reviews/send-review/send-review.component';
import { MyReviewsComponent } from './components/reviews/my-reviews/my-reviews.component';
import { EditReviewComponent } from './components/reviews/edit-review/edit-review.component';
import { SentReviewsComponent } from './components/reviews/sent-reviews/sent-reviews.component';
import { ReceivedReviewsComponent } from './components/reviews/received-reviews/received-reviews.component';

var config = {
  apiKey: "AIzaSyAkf7s6jufCG2a9BS6rb6mS_3G56I-ZBF0",
  authDomain: "sshandv2.firebaseapp.com",
  databaseURL: "https://sshandv2.firebaseio.com",
  projectId: "sshandv2",
  storageBucket: "sshandv2.appspot.com",
  messagingSenderId: "195824216808",
  appId: "1:195824216808:web:c2ccb93ac0557a8fa3f75d"
};



@NgModule({
  declarations: [
    FileSelectDirective,
    AppComponent,
    InicioComponent,
    UserProfileComponent,
    NavbarComponent,
    ForgotPasswordComponent,
    LoginRegisterComponent,
    PostItemComponent,
    InboxComponent,
    SendMsgComponent,
    ViewMessageComponent,
    ItemviewComponent,
    AuthComponent,
    ConfirmPasswordResetComponent,
    ConfirmEmailAddressComponent,
    EditProfileComponent,
    SendReviewComponent,
    MyReviewsComponent,
    EditReviewComponent,
    SentReviewsComponent,
    ReceivedReviewsComponent,
  ],
  imports: [
    NgAisModule.forRoot(),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
