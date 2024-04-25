import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from 'src/app/services/confirm.service';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit{
  public token: string = '';
  public type: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private confirmService: ConfirmService) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.type = params['type'];
    });
  }

  ngOnInit() {
    this.confirmService.confirm(this.token, this.type).then(() => {
      alert('Account confirmed');
      this.router.navigate(['/login']);
    });
  }
}
