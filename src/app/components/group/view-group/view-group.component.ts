import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, GroupDetail } from 'src/app/models/data/Group';
import { User } from 'src/app/models/data/User';
import { UserResponse } from 'src/app/models/responses/user-response';
import { GroupApiService } from 'src/app/services/group-api.service';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent {
  public mode: GroupMode = 'CREATE';
  public group: GroupDetail = new GroupDetail();
  public maxAccessLevel: number = 0;

  public get isEditMode(): boolean {
    return this.mode === 'VIEW' && this.isAdmin;
  }

  public get isAdmin(): boolean {
    return this.group.admins.includes(this.userApi.user.id) || this.mode === 'CREATE';
  }

  public get currentUser(): UserResponse {
    return this.userApi.user;
  }

  public get memberCount(): number {
    return this.group.members.length;
  }

  constructor(private userApi: UserApiService, private groupApi: GroupApiService, protected route: ActivatedRoute, protected router: Router) { 
    this.route.data.subscribe(data => {
      this.mode = data['mode'] || 'CREATE';
      if (this.mode === 'CREATE') {
        this.userApi.getSelfDetailed().then(user => {
          this.group.accessLevel = user.accessLevel - 1;
          this.maxAccessLevel = user.accessLevel - 1;
        });
      }
    });
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mode = 'VIEW';
        this.loadGroup(params['id']);
        this.userApi.getSelfDetailed().then(user => {
          this.maxAccessLevel = user.accessLevel - 1;
        });
      }
    });
  }

  save() {
    if (this.mode === 'CREATE') {
      this.createGroup();
    } else {
      this.updateGroup();
    }
  }

  public back() {
    this.router.navigate(['/home/group/list']);
  }

  public delete() {
    this.groupApi.remove(this.group.id).then(() => {
      this.router.navigate(['/home/group/list']);
    });
  }

  private loadGroup(id: string) {
    this.groupApi.getGroup(id).then(group => {
      this.group = group;
    }).catch(error => {
      this.router.navigate(['/home/group/list']);
    });
  }

  private createGroup() {
    this.groupApi.create(this.group).then(group => {
      this.router.navigate(['/home/group', group.id]);
    }).catch(error => {
      alert(error);
    });
  }

  private updateGroup() {
    this.groupApi.update(this.group).then(group => {
      this.router.navigate(['/home/group', group.id]);
    }).catch(error => {
      alert(error);
    });
  }
}

type GroupMode = 'CREATE' | 'VIEW';