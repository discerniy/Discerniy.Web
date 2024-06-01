import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { TokenResponse } from './auth-api.service';
import { ClientStatus } from '../models/data/Client';
import { PageResponse } from '../models/responses/page-response';
import { ClientPermissions } from '../models/data/ClientPermission';
import { RobotResponse } from '../models/responses/robot-response';
import { Robot } from '../models/data/Robot';

@Injectable({
  providedIn: 'root'
})
export class RobotApiService extends BaseApi {
  public override get apiUrl(): string {
    return '/robots';
  }

  constructor() {
    super();
  }

  getById(id: string): Promise<RobotResponse> {
    return this.toDataResponse(this.get<RobotResponse>(id));
  }

  create(user: Robot): Promise<RobotResponse> {
    user.status = Number(user.status);
    return this.toDataResponse(this.post<RobotResponse>('', user));
  }

  async update(user: Robot): Promise<RobotResponse> {
    return this.toDataResponse(this.put<RobotResponse>(user.id, user));
  }

  async updateStatus(id: string, status: ClientStatus): Promise<RobotResponse> {
    return this.toDataResponse(this.put<RobotResponse>(`${id}/status`, Number(status)));
  }

  async updatePermissions(id: string, permissions: ClientPermissions): Promise<RobotResponse> {
    return this.toDataResponse(this.put<RobotResponse>(`${id}/permissions`, permissions));
  }

  async updateAccessLevel(id: string, accessLevel: number): Promise<RobotResponse> {
    return this.toDataResponse(this.put<RobotResponse>(`${id}/accessLevel`, accessLevel));
  }

  async updateScanRadius(id: string, scanRadius: number): Promise<RobotResponse> {
    return this.toDataResponse(this.put<RobotResponse>(`${id}/scanRadius`, scanRadius));
  }

  async deleteRobot(id: string): Promise<void> {
    return this.toDataResponse<any>(this.delete<void>(id));
  }

  async activate(options: ActivateOptions): Promise<TokenResponse> {
    var response = await this.post<TokenResponse>('activate', options);
    var promise = new Promise<TokenResponse>((resolve, reject) => {
      if (response.status !== 200) {
        this.token = null;
        reject(response);
      }
      if (response.body != null) {
        this.token = response.body.token;
        this.tokenExpiresAt = new Date(response.body.expiresAt);
        resolve(response.body);
      }
    });
    return promise;
  }

  async getRobots(options: GetRobotsOptions) {
    let url = `?Page=${options.page}&Limit=${options.limit}&` +
      `Status=${options.status ?? ''}&Nickname=${options.nickname ?? ''}&`+
      `AccessLevel=${options.accessLevel ?? ''}`;
    return this.toDataResponse(this.get<PageResponse<RobotResponse>>(url));
  }

}

interface ActivateOptions {
  email: string;
  newPassword: string;
  oldPassword: string;
}

type GetRobotsOptions = {
  page: number;
  limit: number;
  status: ClientStatus | undefined | null;
  accessLevel: number | undefined | null;
  nickname: string | undefined | null;
}