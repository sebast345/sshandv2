import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-email-address',
  templateUrl: './confirm-email-address.component.html',
  styleUrls: ['./confirm-email-address.component.css']
})
export class ConfirmEmailAddressComponent implements OnInit {
  code: string;
  constructor(private auth: AuthService, 
    private _route: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle( "Correo verificado, al fin" );
    this.code = this._route.snapshot.queryParams['oobCode'];
    this.verifyEmail(this.code);
  }
  verifyEmail(code){
    this.auth.verifyEmail(code);
  }
}
