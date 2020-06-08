import { Component} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { SharedService } from '../../services/shared/shared.service';
import { HttpClient } from '@angular/common/http';
import { AlgoliaService } from '../../services/algolia/algolia.service';
 
import countriesAndStates from '../../json/countries-and-states.json';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;
  successMessage: string = '';
  maxDate = new Date();
  minDate = new Date();
  countriesAndStates = countriesAndStates;
  countries = [];
  states = [];
  loginAlerts: any[] = [];
  registerAlerts: any[] = [];

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private fireservice: FirestoreService,
    private http: HttpClient,
    private shared: SharedService,
    private algolia: AlgoliaService,
    private titleService: Title
  ) {
    if(!this.authService.isLoggedIn){

    }
    this.titleService.setTitle( "Iniciar sesión o Registro" );
    this.setDates();
    this.createRegisterForm();
    this.createLoginForm();
    this.shared.setStatesListener();
    
   }

   createRegisterForm() {
     this.registerForm = this.fb.group({
       name:['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), Validators.pattern(new RegExp(/([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)\s([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+)/))]],
       email: ['', Validators.required ],
       password: ['',[Validators.required, Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]/)), Validators.maxLength(24), Validators.minLength(8)]],
       repassword: ['',[Validators.required, Validators.pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]/)), Validators.maxLength(24), Validators.minLength(8)]],
       age: ['',Validators.required],
       state: ['Algún sitio'],
       country: ['Alguna parte'],
       avatar: ["no-avatar.png"],
       gender: ['', Validators.required],
       description: ['Sin descripción aún...']
     });
   }
   createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',Validators.required]
    });
  }

   async tryGoogleLogin(){
     let birthdate;
     this.authService.doGoogleLogin()
     .then(async(res)  =>{
       console.log(res);
       let emailExists = await this.algolia.checkIfEmailExists(res.additionalUserInfo.profile.email);
      let userInfo;
      if(res.additionalUserInfo.isNewUser && !emailExists){
          userInfo = {
            name: res.additionalUserInfo.profile.name,
            email: res.additionalUserInfo.profile.email,
            avatar: "no-avatar.png",
            gender: "",
            age: "",
            state: "Algún lugar",
            country: "Alguna parte",
            description: "Sin descripción aún..."
          }
          this.http
          .get("https://people.googleapis.com/v1/people/"+res.additionalUserInfo.profile['id']+"?key=AIzaSyAkf7s6jufCG2a9BS6rb6mS_3G56I-ZBF0&personFields=birthdays,genders&access_token="+res.credential['accessToken'])
          .subscribe((res: any) => {
            if(res.genders && (res.genders[0].value !== "male" || res.genders[0].value !== "female"))
              userInfo.gender = res.genders[0].value;
            userInfo.age = res.birthdays[0].date.year+"-"+res.birthdays[0].date.month+"-"+res.birthdays[0].date.day;

            birthdate = new Date(userInfo.age);
            if(birthdate > this.maxDate){
              this.authService.deleteUser();
              this.loginAlerts.push({
                type: 'danger',
                msg: `Lo sentimos, siendo menor no puedes acceder a esta web.`,
                timeout: 2000,
                error: true,
              });
            }
            else{
              if(!emailExists)
                this.fireservice.createUser(userInfo);
              this.loginAlerts.push({
                type: 'success',
                msg: `Has iniciado sesión, ahora serás redireccionado`,
                timeout: 3000,
                error: false,
              });
            }
              
          });        
      }
     }, err => {
        console.log(err);
        this.loginAlerts.push({
          type: 'danger',
          msg: `Algo raro ha pasado, intentalo de nuevo más tarde.`,
          timeout: 2000,
          error: true,
        });
     }
     )
   }

   tryRegister(value){
     if(value.password == value.repassword){
      value.age = value.age.getFullYear()+"-"+value.age.getMonth()+"-"+value.age.getDate();
      this.authService.doRegister(value)
      .then(res => {
        console.log(res);
        delete value.password;
        delete value.repassword;
        this.fireservice.createUser(value);
        this.registerAlerts.push({
          type: 'success',
          msg: `Cuenta creada, ahora serás redireccionado.`,
          timeout: 3000,
          error: false,
        });
      }, err => {
        console.log(err);
        switch(err.code){
          case "auth/email-already-in-use": 
          this.registerAlerts.push({
            type: 'danger',
            msg: `Ese email ya está en uso.`,
            timeout: 2000,
            error: true,
          });
          ;break;
          case "auth/email-already-exists": 
          this.registerAlerts.push({
            type: 'danger',
            msg: `Ese email ya está en uso.`,
            timeout: 2000,
            error: true,
          });
          ;break;
          default:
          this.registerAlerts.push({
            type: 'danger',
            msg: `Es email no existe`,
            timeout: 2000,
            error: true,
          });
          ;break;
        }
      })
    }else{
      this.registerAlerts.push({
        type: 'danger',
        msg: `Las contraseñas deben ser iguales`,
        timeout: 2000,
        error: true,
      });
    }
   }
   tryLogin(value){
    this.authService.login(value.email, value.password)
    .then(res => {
      this.loginAlerts.push({
        type: 'success',
        msg: `Has iniciado sesión, serás redireccionado.`,
        timeout: 3000,
        error: false,
      });
    }, err => {
      console.log(err);
      switch(err.code){
        case "auth/wrong-password": 
        this.loginAlerts.push({
          type: 'danger',
          msg: `Contraseña incorrecta, intentalo de nuevo`,
          timeout: 2000,
          error: true,
        });
        ;break;
        case "auth/invalid-email": 
        this.loginAlerts.push({
          type: 'danger',
          msg: `Ese email no existe`,
          timeout: 2000,
          error: true,
        });
        ;break;
        default: this.loginAlerts.push({
          type: 'danger',
          msg: `Algo raro ha pasado, intentalo de nuevo más tarde`,
          timeout: 2000,
          error: true,
        });
        ;break;
      }
    })
   }
   setDates(){
    this.maxDate.setFullYear( this.maxDate.getFullYear() - 18);
    this.minDate.setFullYear( this.maxDate.getFullYear() - 120);
    
   }
  onClose(error){
    if(!error)
      window.location.href = './user-profile';
  }

}