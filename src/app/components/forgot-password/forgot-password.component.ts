import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor( private auth: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
  }
  PasswordResetForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  sendPasswordResetEmail(email){
    this.auth.sendPasswordResetEmail(email).then(
      () => {
        alert("enviado correctamente");
      },
      err => {
        console.log(err.code);
      }
    );
  }
}
