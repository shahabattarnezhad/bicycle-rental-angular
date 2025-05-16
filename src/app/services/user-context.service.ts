import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class UserContextService {
    private readonly tokenKey = 'auth_token';
    private decodedToken: DecodedToken | null = null;

    constructor() {
        this.initialize();
    }

    initialize(): void {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) {
            this.decodedToken = null;
            return;
        }

        try {
            this.decodedToken = jwtDecode<DecodedToken>(token);
        } catch (err) {
            console.error('خطا در دیکود کردن توکن:', err);
            this.decodedToken = null;
        }
    }

    private getDecodedToken(): DecodedToken | null {
        return this.decodedToken;
    }

    get userId(): string | null {
        const decoded = this.getDecodedToken();
        return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null;
    }

    get username(): string | null {
        const decoded = this.getDecodedToken();
        return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? null;
    }

    get fullName(): string | null {
        const decoded = this.getDecodedToken();
        const first = decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ?? '';
        const last = decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] ?? '';
        return `${first} ${last}`.trim();
    }

    get status(): string | null {
        const decoded = this.getDecodedToken();
        return decoded?.['status'] ?? null;
    }

    get roles(): string[] {
        const decoded = this.getDecodedToken();
        const rawRoles = decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        if (Array.isArray(rawRoles)) return rawRoles;
        if (typeof rawRoles === 'string') return [rawRoles];
        return [];
    }

    isInRole(role: string): boolean {
        return this.roles.includes(role);
    }

    isLoggedIn(): boolean {
        return !!this.getDecodedToken();
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
        this.decodedToken = jwtDecode(token);
    }

    clearToken(): void {
        localStorage.removeItem(this.tokenKey);
        this.decodedToken = null;
    }

    get isAuthenticated(): boolean {
        return this.isLoggedIn();
    }
}
