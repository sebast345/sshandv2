import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  alerts: any[] = [];
  editProfile: boolean;
  constructor( private auth: AuthService, 
    private fb: FormBuilder,
    private titleService: Title) { }

  ngOnInit() {
    
    if(window.location.href.substring(0,35) == "http://localhost:4200/edit-profile")
      this.editProfile = true;
    else
      this.titleService.setTitle( "Proceso de contraseña olvidada" );
  }
  PasswordResetForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  sendPasswordReset(email){
    this.sendResetEmail(email);
    
  }
  sendPasswordChange(){
    let email = JSON.parse(localStorage.getItem('user')).email;
    this.sendResetEmail(email);
    
  }
  sendResetEmail(email){
    this.auth.sendPasswordResetEmail(email).then(
      () => {
        this.alerts.push({
          type: 'info',
          msg: `Se ha enviado un link a tu correo, revisalo.`,
          timeout: 3000
        });
      },
      err => {
        this.alerts.push({
          type: 'danger',
          msg: `Ese correo no está en nuestra base de datos.`,
          timeout: 3000
        });
      }
    );
  }
}

