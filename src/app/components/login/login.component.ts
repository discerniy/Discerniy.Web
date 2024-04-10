import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public email: string = "";
  public password: string = "";

  constructor(private translate: TranslateService, private authApi: AuthApiService, private router: Router){}
  ngOnInit(): void {
    if(this.authApi.isAuthenticatedUser){
      this.router.navigate(['/home']);
    }
  }

  public onLogin(){
    this.authApi.login({email: this.email, password: this.password})
      .then(response => {
        if(response.ok){
          this.router.navigate(['/home']);
        } else {
          alert(this.translate.instant('login.error'));
        }
      });
  }
}
