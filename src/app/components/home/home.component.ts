import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isMapPage: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      let splitUrl = this.router.url.split('/');
      if(splitUrl.length > 1 && splitUrl[1] == 'home' && splitUrl[2] == 'map'){
        this.isMapPage = true;
      }else {
        this.isMapPage = false;
      }
    });
  }
}
