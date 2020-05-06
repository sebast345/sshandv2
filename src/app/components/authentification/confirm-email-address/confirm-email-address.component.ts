import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-confirm-email-address',
  templateUrl: './confirm-email-address.component.html',
  styleUrls: ['./confirm-email-address.component.css']
})
export class ConfirmEmailAddressComponent implements OnInit {
  code: string;
  constructor(private auth: AuthService, private fb: FormBuilder, private _route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.code = this._route.snapshot.queryParams['oobCode'];
    this.verifyEmail(this.code);
  }
  verifyEmail(code){
    this.auth.verifyEmail(code);
  }
}
