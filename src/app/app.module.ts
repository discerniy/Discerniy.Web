import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
import { TableComponent } from './components/table/table.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { UserListAdministrationComponent } from './components/admin/users/user-list-administration/user-list-administration.component';
import { PermissionGuard } from './permission.guard';
import { UserAdministrationComponent } from './components/admin/users/user-administration/user-administration.component';
import { NgxTranslateModule } from './translate.module';
import { ActivationPageComponent } from './components/activation-page/activation-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MapComponent,
    TableComponent,
    NavBarComponent,
    UserSettingsComponent,
    UserListAdministrationComponent,
    UserAdministrationComponent,
    ActivationPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxTranslateModule
  ],
  providers: [AuthGuard, PermissionGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
