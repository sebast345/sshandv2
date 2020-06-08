import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../../services/firestore/firestore.service';
import { ActivatedRoute} from '@angular/router';
import { AlgoliaService } from 'src/app/services/algolia/algolia.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-send-review',
  templateUrl: './send-review.component.html',
  styleUrls: ['./send-review.component.css']
})
export class SendReviewComponent implements OnInit {
  public toID: string;
  reviewData: [];
  userData: [];
  reviewSent = false;
  alerts: any[] = [];
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
    private algolia: AlgoliaService,
    private titleService: Title) { }

  ngOnInit() {
    this.getData();
    
    
  }
  createForm() { 
    if(this.reviewData)
      this.reviewForm = this.fb.group({
        text: [this.reviewData['text'], [Validators.required, Validators.maxLength(50)]],
        points: [this.reviewData['points'], Validators.required ]
      });
    
    else
      this.reviewForm = this.fb.group({
        text: ['', [Validators.required, Validators.maxLength(50)]],
        points: ['', Validators.required ]
      });
  }
  async getData(){
    this.toID  = this._route.snapshot.queryParams['to'];
    
    
    if(this._route.snapshot.queryParams['r'])
      this.reviewData = await this.algolia.getReviewById(this._route.snapshot.queryParams['r']);
    if(this.toID)
      this.userData = await this.algolia.getUserById(this.toID);
    else 
      this.userData = await this.algolia.getUserById(this.reviewData['to_id']);
    this.titleService.setTitle( "Enviar opinion de "+this.userData['name'] );
    this.createForm();
  }
  sendReview(value){

    if(this.reviewData){
      value.to_id = this.reviewData['to_id'];
      value.objectID = this.reviewData['objectID'];
    }
    else
      value.to_id = this.toID;
    value.to_name = this.userData['name'];
    value.from_name = JSON.parse(localStorage.getItem('user')).name;
    this.fireservice.sendReview(value);
    this.reviewSent = true;
    this.sendSuccessAlert();

  }
  sendSuccessAlert(){
    this.alerts.push({
      type: 'success',
      msg: `Opinión enviada, serás redirigido.`,
      timeout: 3000
    });

  }
  historyBack(){
    window.history.back();
  }

}
