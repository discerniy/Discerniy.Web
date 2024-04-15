import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MapComponent } from './components/map/map.component';
import { AuthGuard } from './auth.guard';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserListAdministrationComponent } from './components/admin/users/user-list-administration/user-list-administration.component';
import { PermissionGuard } from './permission.guard';
import { UserAdministrationComponent } from './components/admin/users/user-administration/user-administration.component';
import { ActivationPageComponent } from './components/activation-page/activation-page.component';
import { ViewGroupComponent } from './components/group/view-group/view-group.component';
import { GroupListComponent } from './components/group/group-list/group-list.component';
import { GroupMemberListComponent } from './components/group/group-member-list/group-member-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children:
      [
        { path: 'map', component: MapComponent },
        {
          path: 'user', children: [
            { path: 'settings', component: UserSettingsComponent }
          ]
        },
        {
          path: 'admin', children: [
            { path: 'users/new', component: UserAdministrationComponent, canActivate: [PermissionGuard], data: { ...PermissionGuard.has((p) => p.users.canCreate), mode: 'CREATE' } },
            { path: 'users/:id', component: UserAdministrationComponent, canActivate: [PermissionGuard], data: { ...PermissionGuard.has((p) => p.users.canRead), mode: 'VIEW' } },
            { path: 'users', component: UserListAdministrationComponent, canActivate: [PermissionGuard], data: PermissionGuard.has((p) => p.users.canRead) }
          ]
        },
        {
          path: 'group', children: [
            { path: 'new', component: ViewGroupComponent, canActivate: [PermissionGuard], data: { ...PermissionGuard.has((p) => p.groups.canCreate), mode: 'CREATE' } },
            {
              path: 'list', children: [
                { path: '', component: GroupListComponent, canActivate: [PermissionGuard], data: PermissionGuard.has((p) => p.groups.canRead) },
                { path: 'my', component: GroupListComponent, data: { mode: 'MY' } }
              ]
            },
            {
              path: '', canActivate: [PermissionGuard], data: { ...PermissionGuard.has((p) => p.groups.canRead) }, children: [
                { path: ':id', component: ViewGroupComponent, data: { mode: 'VIEW' } },
                { path: ':id/members', component: GroupMemberListComponent }
              ]
            },
          ]
        },
        { path: '', redirectTo: 'map', pathMatch: 'full' }
      ]
  },
  {
    path: 'account', children: [
      { path: 'activate', component: ActivationPageComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
