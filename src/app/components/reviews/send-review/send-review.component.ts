import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlgoliaService } from 'src/app/services/algolia/algolia.service';

@Component({
  selector: 'app-send-review',
  templateUrl: './send-review.component.html',
  styleUrls: ['./send-review.component.css']
})
export class SendReviewComponent implements OnInit {
  public toID: string;
  reviewData: [];
  reviewSent = false;
  alerts: any[];
  points = [
    1,
    2,
    3,
    4,
    5
  ]
  reviewForm: FormGroup;
  successMessage: string = '';
  constructor(private _route: ActivatedRoute,
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private algolia: AlgoliaService) { }

  ngOnInit() {
    this.getData();
    this.createForm();
  }
  createForm() { 
    this.reviewForm = this.fb.group({
      text: ['',Validators.required],
      points: ['',Validators.required]
    });
  }
  async getData(){
    this.toID  = this._route.snapshot.queryParams['to'];
    if(this._route.snapshot.queryParams['r'])
      this.reviewData = await this.algolia.getReviewById(this._route.snapshot.queryParams['r']);
    console.log(this.reviewData);
  }
  sendReview(value){

    if(this.reviewData){
      value.to_id = this.reviewData['to_id'];
      value.objectID = this.reviewData['objectID'];
    }
    else
      value.to_id = this.toID;
    this.fireservice.sendReview(value);
    this.successMessage = 'Opinión enviada';
    this.reviewSent = true;

  }
  sendSuccessAlert(){
    this.alerts.push({
      type: 'success',
      msg: `Opinión enviada, serás redirigido.`,
      timeout: 2000
    });

  }

}
