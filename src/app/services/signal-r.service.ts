import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { GeoCoordinates } from '../models/data/GeoCoordinates';
import { Alert, AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private connection: signalR.HubConnection | null = null;
  private warnMessage: Alert | null = null;

  public get isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  constructor(private storage: StorageService, private alertsService: AlertsService) { }

  public connect() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalRUrl, {
        accessTokenFactory: () => {
          return this.storage.token ?? '';
        }
      })
      .build();

    this.connection.start().then(() => {
      console.log('SignalR connected');

      this.connection?.on('warning', (response: {message: string, details: string}) => {
        if(this.warnMessage == null) {
          this.warnMessage = this.alertsService.add(new Alert('warning', `SignalR: ${response.message}`, {
            lifetime: 0,
            index: 999_999_999,
            onclose: (alert: Alert) => {
              this.warnMessage = null;
              console.info('Message removed', this.warnMessage);
            }
          }));
          console.info('Message added', this.warnMessage);
        }
        this.warnMessage.message = `SignalR: ${response.message}`;
      });

    }).catch(err => {
      console.error('SignalR connection failed', err);
    });

    this.connection.onclose(() => {
      console.log('SignalR connection closed');
    });
  }
  public on(methodName: string, newMethod: (...args: any[]) => any) {
    this.connection?.on(methodName, newMethod);
  }

  public off(methodName: string, method: (...args: any[]) => any) {
    this.connection?.off(methodName, method);
  }

  public updateLocation(location: GeoCoordinates) {
    return this.invoke('UpdateLocation', location);
  }

  public invoke(methodName: string, ...args: any[]) {
    if (!this.isConnected) {
      return Promise.reject('SignalR is not connected');
    }
    return this.connection?.invoke(methodName, ...args);
  }
}
