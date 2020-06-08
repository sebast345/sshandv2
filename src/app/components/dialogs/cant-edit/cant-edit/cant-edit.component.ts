import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-cant-edit',
  templateUrl: './cant-edit.component.html',
  styleUrls: ['./cant-edit.component.css']
})
export class CantEditComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<CantEditComponent>, private router: Router) { }

  ngOnInit() {
  }

  home() {
    this.router.navigate(["home"]);
    this.dialogRef.close();
}
}
