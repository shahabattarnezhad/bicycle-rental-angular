import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpService } from './http.service';
import { ApiResponse } from '../models/ApiResponse.model';
import { RegisterDto } from '../models/RegisterDto.model';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../models/decoded-token.model';
import { LoginDto } from '../models/LoginDto.model';
import { UserContextService } from './user-context.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private currentTokenSubject = new BehaviorSubject<any>(null);


  constructor(private http: HttpService, private userContext: UserContextService) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.currentTokenSubject.next(token);
    }
  }

  register(data: RegisterDto) {
    return this.http.post<ApiResponse<string>>('auth/register', data).pipe(
      tap(response => {
        if (response.success && response.data) {
          const token = response.data;
          this.userContext.setToken(token);
          this.currentTokenSubject.next(token);
          localStorage.setItem(this.tokenKey, token);
          this.userContext.initialize();
        } else {
          this.userContext.clearToken();
          this.currentTokenSubject.next(null);
          console.error('Registration failed:', response.message, response.errors);
        }
      })
    );
  }

  login(credentials: LoginDto) {
    return this.http.post<ApiResponse<string>>('auth/login', credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          const token = response.data;
          this.userContext.setToken(token);
          this.currentTokenSubject.next(token);
          localStorage.setItem(this.tokenKey, token);
        } else {
          this.userContext.clearToken();
          this.currentTokenSubject.next(null);
          console.error('Login failed:', response.message, response.errors);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentTokenSubject.next(null);
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser$() {
    return this.currentTokenSubject.asObservable();
  }

  getRolesFromToken(): string[] {
    const token = this.token;
    if (!token) return [];

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const rawRoles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (Array.isArray(rawRoles)) return rawRoles;
      if (typeof rawRoles === 'string') return [rawRoles];
      return [];
    } catch (err) {
      console.error('خطا در دیکود کردن توکن', err);
      return [];
    }
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
