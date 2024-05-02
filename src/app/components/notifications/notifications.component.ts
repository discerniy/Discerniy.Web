import { Component, OnInit } from '@angular/core';
import { Alert, AlertsService } from 'src/app/services/alerts.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public get alerts() {
    return this.alertsService.list;
  }
  constructor(private alertsService: AlertsService) { }
  async ngOnInit(): Promise<void> {

    this.alertsService.add(new Alert('success', 'This is a success alert with <strong>HTML</strong>.', {
      lifetime: 15_000,
      onclick: (caller: Alert) => {
        console.log('Alert clicked:', caller.id);
      }
    }));
  }

  close(alert: Alert) {
    this.alertsService.remove(alert);
  }

  click(alert: Alert, event: MouseEvent) {
    if(event.target instanceof HTMLElement && event.target.closest('.btn-close')) {
      return;
    }
    if (alert.onclick) {
      alert.onclick(alert);
    }
  }
}
