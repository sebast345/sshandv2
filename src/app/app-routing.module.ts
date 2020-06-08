import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './components/profile/forgot-password/forgot-password.component';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { UserProfileComponent } from './components/profile/user-profile/user-profile.component';
import { PostItemComponent } from './components/items/post-item/post-item.component';
import { InboxComponent } from './components/messages/inbox/inbox.component';
import { SendMsgComponent } from './components/messages/send-msg/send-msg.component';
import { ItemviewComponent } from './components/items/itemview/itemview.component';
import { AuthComponent } from './components/authentification/auth/auth.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { SendReviewComponent } from './components/reviews/send-review/send-review.component';
import { MyReviewsComponent } from './components/reviews/my-reviews/my-reviews.component';
import { ReceivedReviewsComponent } from './components/reviews/received-reviews/received-reviews.component';
import { MyItemsComponent } from './components/items/my-items/my-items.component';
import { UserReviewsComponent } from './components/reviews/user-reviews/user-reviews.component';
import { EditItemComponent } from './components/items/edit-item/edit-item.component';

const routes: Routes= [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: InicioComponent },
  { path: 'post-item', component: PostItemComponent },
  { path: 'edit-item', component: EditItemComponent },
  { path: 'send-msg', component: SendMsgComponent},
  { path: 'inbox', component: InboxComponent},
  { path: 'forgot-password', component:  ForgotPasswordComponent },
  { path: 'login-register', component:  LoginRegisterComponent },
  { path: 'user-profile', component:  UserProfileComponent },
  { path: 'item', component:  ItemviewComponent },
  { path: 'auth/email/action', component: AuthComponent},
  { path: 'edit-profile', component: EditProfileComponent},
  { path: 'send-review', component: SendReviewComponent},
  { path: 'my-reviews', component: MyReviewsComponent },
  { path: 'user-reviews', component: ReceivedReviewsComponent },
  { path: 'my-items', component: MyItemsComponent },
  { path: 'reviews', component: UserReviewsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
