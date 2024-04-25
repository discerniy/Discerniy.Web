import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { GeoCoordinates } from '../models/data/GeoCoordinates';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private connection: signalR.HubConnection | null = null;

  public get isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  constructor(private storage: StorageService) { }

  public connect() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalRUrl, {
        accessTokenFactory: () => {
          return this.storage.token || '';
        }
      })
      .build();

    this.connection.start().then(() => {
      console.log('SignalR connected');
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
