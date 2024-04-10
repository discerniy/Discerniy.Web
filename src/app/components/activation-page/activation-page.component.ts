import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { Title } from '@angular/platform-browser';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-activation-page',
  templateUrl: './activation-page.component.html',
  styleUrls: ['./activation-page.component.css']
})
export class ActivationPageComponent {

  public passwordRequirements: {
    [key: string]: { valid: boolean }
  } = {
      'activationPage.error.passwordsDoNotMatch': {
        valid: true
      },
      'activationPage.error.passwordTooShort': {
        valid: false
      },
      'activationPage.error.passwordTooLong': {
        valid: false
      },
      'activationPage.error.passwordNoNumber': {
        valid: false
      },
      'activationPage.error.passwordNoLetter': {
        valid: false
      },
      'activationPage.error.passwordNoSpecial': {
        valid: false
      },
      'activationPage.error.passwordNoUppercase': {
        valid: false
      },
      'activationPage.error.passwordNoLowercase': {
        valid: false
      },
      'activationPage.error.passwordWhitespace': {
        valid: false
      }
    };

  public email: string = "";
  public oldPassword: string = "";
  public newPassword: string = "";
  public confirmPassword: string = "";

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private translate: TranslateService, private titleService: Title, private userApi: UserApiService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];
      this.oldPassword = params['password'];
    });
    this.translate.onLangChange.subscribe(() => {
      let title = this.translate.instant('activationPage.title');
      this.titleService.setTitle(title);
    });
  }

  validatePassword() {

    this.passwordRequirements['activationPage.error.passwordsDoNotMatch'].valid = this.newPassword === this.confirmPassword;
    this.passwordRequirements['activationPage.error.passwordTooShort'].valid = this.newPassword.length >= 8;
    this.passwordRequirements['activationPage.error.passwordTooLong'].valid = this.newPassword.length <= 65;
    this.passwordRequirements['activationPage.error.passwordNoNumber'].valid = /\d/.test(this.newPassword);
    this.passwordRequirements['activationPage.error.passwordNoLetter'].valid = /[a-zA-Z]/.test(this.newPassword);
    this.passwordRequirements['activationPage.error.passwordNoSpecial'].valid = /[^a-zA-Z0-9]/.test(this.newPassword);
    this.passwordRequirements['activationPage.error.passwordNoUppercase'].valid = /[A-Z]/.test(this.newPassword);
    this.passwordRequirements['activationPage.error.passwordNoLowercase'].valid = /[a-z]/.test(this.newPassword);
    this.passwordRequirements['activationPage.error.passwordWhitespace'].valid = !/\s/.test(this.newPassword);

    for (let key in this.passwordRequirements) {
      if (!this.passwordRequirements[key].valid) {
        return false;
      }
    }
    return true;
  }

  submit() {
    if(!this.validatePassword()) {
      return;
    }
    this.userApi.activate({
      email: this.email,
      newPassword: this.newPassword,
      oldPassword: this.oldPassword
    }).then(() => {
      this.router.navigate(['/home']);
    }).catch(() => {
      this.router.navigate(['/home']);
    });
  }
}
