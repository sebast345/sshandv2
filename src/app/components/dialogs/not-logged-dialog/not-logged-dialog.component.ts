import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-not-logged-dialog',
  templateUrl: './not-logged-dialog.component.html',
  styleUrls: ['./not-logged-dialog.component.css']
})
export class NotLoggedDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<NotLoggedDialogComponent>, private router: Router) { }

  ngOnInit() {
  }

home() {
  this.router.navigate(["home"]);
  this.dialogRef.close();
}

login() {
  this.router.navigate(["login-register"]);
  this.dialogRef.close();
}
}
