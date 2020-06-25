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
  rePasswordAlerts: any[] = [];
  constructor(private auth: AuthService, 
    private fb: FormBuilder, 
    private _route: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle( "Configurar nueva contraseña" );
    this.code = this._route.snapshot.queryParams['oobCode'];
  }
  formConfirmPassword = this.fb.group({
    password: ['',[Validators.required, Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]/)), Validators.maxLength(24), Validators.minLength(8)]],
    repassword: ['',[Validators.required, Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]/)), Validators.maxLength(24), Validators.minLength(8)]],
  });

  confirmPasswordReset(value){
    var password = value.password;
    var repassword = value.repassword;

    if (password == repassword) {
      this.auth.confirmPasswordReset(this.code, password);
      if(this.auth.isLoggedIn)
      this.rePasswordAlerts.push({
        type: 'success',
        msg: `Has cambiado tu contraseña satisfactoriamente, serás redirigido a tu perfil.`,
        timeout: 3000,
        error: "profile",  
      });
      else
      this.rePasswordAlerts.push({
        type: 'success',
        msg: `Has cambiado tu contraseña satisfactoriamente, ya puedes iniciar sesión.`,
        timeout: 3000,
        error: "login",  
      });
    }else{
      this.rePasswordAlerts.push({
        type: 'danger',
        msg: `Las contraseñas deben ser iguales`,
        timeout: 2000,
        error: true,
      });
    }
  }
  onClose(error){

    if(error == "profile")
      window.location.href = '/user-profile';
    else if(error == "login")
      window.location.href = '/login-register';
  }
}
