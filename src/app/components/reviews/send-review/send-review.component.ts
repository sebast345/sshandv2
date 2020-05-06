import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-send-review',
  templateUrl: './send-review.component.html',
  styleUrls: ['./send-review.component.css']
})
export class SendReviewComponent implements OnInit {
  public toID: string;
  points = [
    1,
    2,
    3,
    4,
    5
  ]
  reviewForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  constructor(private _route: ActivatedRoute,
    private fb: FormBuilder,
    private fireservice: FirestoreService) { }

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.toID = this._route.snapshot.paramMap.get('toId');
    this.reviewForm = this.fb.group({
      text: ['',Validators.required],
      points: ['',Validators.required]
    });
  }

  sendReview(value){

    value.to_id = this.toID;
    this.fireservice.sendReview(value);
  }

}
