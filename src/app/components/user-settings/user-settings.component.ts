import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientStatus } from 'src/app/models/data/Client';
import { User } from 'src/app/models/data/User';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {
  userModel: User = new User();

  constructor(private userApi: UserApiService, private router: Router) {
    this.userApi.getSelfDetailed().then(user => {
      this.userModel = User.fromResponse(user);
    });
  }
  statusToText(): string {
    switch (this.userModel.status) {
      case ClientStatus.Active:
        return 'active';
      case ClientStatus.Inactive:
        return 'inactive';
      case ClientStatus.Banned:
        return 'blocked';
      case ClientStatus.Limited:
        return 'limited';
      default:
        return 'unknown';
    }
  }

  save() {
  }

  cancel() {
    this.router.navigate(['/home/map']);
  }
}
