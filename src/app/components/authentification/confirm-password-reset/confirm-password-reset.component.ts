import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-password-reset',
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.css']
})
export class ConfirmPasswordResetComponent implements OnInit {
  code: string;
  errormsg: string;
  constructor(private auth: AuthService, 
    private fb: FormBuilder, 
    private _route: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle( "Configurar nueva contraseña" );
    this.code = this._route.snapshot.queryParams['oobCode'];
  }
  formConfirmPassword = this.fb.group({
    password: [null, [Validators.required]],
    rePassword: [null, [Validators.required]]
  });

  confirmPasswordReset(value){
    var password = value.password;
    var rePassword = value.rePassword;

    if (password == rePassword) {
      this.auth.confirmPasswordReset(this.code, password);
    }else{
      this.errormsg = "Las contraseñas deben ser iguales";
    }
  }
}
