import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FirestoreService } from '../../../../services/firestore/firestore.service'

@Component({
  selector: 'app-delete-for-sure',
  templateUrl: './delete-for-sure.component.html',
  styleUrls: ['./delete-for-sure.component.css']
})
export class DeleteForSureComponent implements OnInit {
  
  constructor(private dialogRef: MatDialogRef<DeleteForSureComponent>, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: FirestoreService) { 
    
  }

  ngOnInit() {
  }

  delete() {
    this.firestore.deleteItem(this.data.id);
    setTimeout(() => {
      this.router.navigate(["home"]);
    }, 2000);
    
    this.dialogRef.close();
  }
  close(){
    this.dialogRef.close();
  }
}
