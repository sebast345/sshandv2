import { Component, OnInit } from '@angular/core';

import { LogoutdialogComponent } from '../dialogs/logoutdialog/logoutdialog.component';
import { AuthService } from '../../services/auth/auth.service'
import { MatDialog, MatDialogConfig } from "@angular/material";
import { AlgoliaService } from '../../services/algolia/algolia.service'
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material'; 





@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
userData: {};
newMsgNumber: number;
userPoints;
isLoggedIn: boolean;
isVerified: boolean;

  show = true;

  constructor(private algolia: AlgoliaService, private auth: AuthService, public dialog: MatDialog) { }
  
  ngOnInit() {
    this.getData();
    
  }
  async getData(){
    
    this.isLoggedIn = this.auth.isLoggedIn;
    if(this.isLoggedIn){
      this.isVerified = this.auth.isVerified;
      this.newMsgNumber = await this.algolia.getNewMsgNumber();
      
      this.userData = await this.algolia.getActualUserData();
      this.userPoints = await this.algolia.getUserPoints(this.userData['objectID']);
      console.log(this.userPoints)
      if(!this.userPoints){
        this.userPoints = null;
      }
    }
    
  }
  logout(){
    this.auth.logout();
  }
  openLogoutDialog() {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;


      this.dialog.open(LogoutdialogComponent, dialogConfig);
  }
}
