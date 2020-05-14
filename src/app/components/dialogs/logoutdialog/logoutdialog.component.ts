import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { AuthService } from '../../../services/auth/auth.service'

@Component({
  selector: 'app-logoutdialog',
  templateUrl: './logoutdialog.component.html',
  styleUrls: ['./logoutdialog.component.css']
})
export class LogoutdialogComponent implements OnInit {

  constructor( private dialogRef: MatDialogRef<LogoutdialogComponent>, private auth: AuthService) { }

  ngOnInit() {
  }

  logout() {
      this.auth.logout();
      this.dialogRef.close();
  }

  close() {
      this.dialogRef.close();
  }

}
