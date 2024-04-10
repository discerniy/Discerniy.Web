import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { UserResponse, UserResponseDetailed } from '../models/responses/user-response';
import { User } from '../models/data/User';
import { TokenResponse } from './auth-api.service';
import { ClientStatus } from '../models/data/Client';
import { PageResponse } from '../models/responses/page-response';
import { ClientPermissions } from '../models/data/ClientPermission';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends BaseApi {
  private _user: UserResponse = new UserResponse();

  public override get apiUrl(): string {
    return '/users';
  }

  public get user(): UserResponse {
    return this._user;
  }

  constructor() { 
    super();
  }

  async getSelf(): Promise<UserResponse> {
    if (this._user.id) {
      return this._user;
    }
    let user = await this._getSelf({ detailed: false });
    this._user = user;
    return user;
  }

  async getSelfDetailed(): Promise<UserResponseDetailed> {
    let user = await this._getSelf({ detailed: true });
    this._user = user as UserResponse;
    return user;
  }

  async getById(id: string): Promise<UserResponseDetailed> {
    var response = await this.get<UserResponseDetailed>(id);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async create(user: User): Promise<UserResponseDetailed> {
    var response = await this.post<UserResponseDetailed>('', user);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async update(user: User): Promise<UserResponseDetailed> {
    var response = await this.put<UserResponseDetailed>(user.id, user);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async updateStatus(id: string, status: ClientStatus): Promise<UserResponseDetailed> {
    var response = await this.put<UserResponseDetailed>(`${id}/status`, Number(status));
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async updatePassword(id: string, password: string): Promise<UserResponseDetailed> {
    var response = await this.put<UserResponseDetailed>(`${id}/password`, password);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async updatePermissions(id: string, permissions: ClientPermissions): Promise<UserResponseDetailed> {
    var response = await this.put<UserResponseDetailed>(`${id}/permissions`, permissions);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async updateAccessLevel(id: string, accessLevel: number): Promise<UserResponseDetailed> {
    var response = await this.put<UserResponseDetailed>(`${id}/accessLevel`, accessLevel);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async updateScanRadius(id: string, scanRadius: number): Promise<UserResponseDetailed> {
    var response = await this.put<UserResponseDetailed>(`${id}/scanRadius`, scanRadius);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  async deleteUser(id: string): Promise<void> {
    var response = await this.delete<any>(`${id}`);
    var promise = new Promise<void>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      resolve();
    });
    return promise;
  }

  async resetPassword(id: string): Promise<void> {
    var response = await this.put<any>(`${id}/resetPassword`, "");
    var promise = new Promise<void>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      resolve();
    });
    return promise;
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

  async getUsers(options: GetUsersOptions){
    let url = `?Page=${options.page}&Limit=${options.limit}&Status=${options.status ?? ''}&FirstName=${options.firstName ?? ''}&LastName=${options.lastName ?? ''}&TaxPayerId=${options.taxPayerId ?? ''}&Email=${options.email ?? ''}`;
    var response = await this.get<PageResponse<UserResponseDetailed>>(url);
    var promise = new Promise<PageResponse<UserResponseDetailed>>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }

  private async _getSelf(options: GetSelfOptions): Promise<UserResponseDetailed> {
    var response = await this.get<UserResponseDetailed>(`self?detailed=${options.detailed}`);
    var promise = new Promise<UserResponseDetailed>((resolve, reject) => {
      if (response.status !== 200) {
        reject(response);
      }
      if (response.body != null) {
        resolve(response.body);
      }
    });
    return promise;
  }
}

interface GetSelfOptions {
  detailed: boolean | 'true' | 'false'
}

interface ActivateOptions {
  email: string;
  newPassword: string;
  oldPassword: string;
}

type GetUsersOptions = {
  page: number;
  limit: number;
  status: ClientStatus | undefined | null;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  taxPayerId: string | undefined | null;
  email: string | undefined | null;
}