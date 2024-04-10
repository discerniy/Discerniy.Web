import { Injectable } from '@angular/core';
import { BaseApi } from './base-api';
import { UserResponse } from '../models/responses/user-response';
import { ClientPermissions } from '../models/data/ClientPermission';

@Injectable({
    providedIn: 'root'
})
export class AuthApiService extends BaseApi {
    public override get apiUrl(): string {
        return '/auth';
    }

    public get isAuthenticatedUser(): boolean {
        return this.isAuthenticated;
    }

    constructor() {
        super();
    }

    async login(data: LoginRequest) {
        let response = await this.post<TokenResponse>('login', data);
        if (response.ok && response.body != null) {
            this.token = response.body.token;
            this.tokenExpiresAt = new Date(response.body.expiresAt);
        } else {
            localStorage.removeItem(this.authSecretKey);
        }
        return response;
    }

    logout() {
        this.token = null;
    }

    register(data: RegisterRequest) {
        return this.post<UserResponse>('register', data);
    }

    refreshToken() {
        return this.post<UserResponse>('refresh', {});
    }
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    permissions: ClientPermissions;
    groupId: string;
}

export interface TokenResponse {
    token: string;
    expiresAt: Date;
}