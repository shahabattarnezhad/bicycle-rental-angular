import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserContextService } from './user-context.service';

@Injectable({ providedIn: 'root' })
export class RedirectService {
    private returnUrl: string | null = null;

    constructor(private router: Router, private userContext: UserContextService) { }

    setReturnUrl(url: string) {
        this.returnUrl = url;
    }

    getReturnUrl(): string | null {
        return this.returnUrl;
    }

    clearReturnUrl() {
        this.returnUrl = null;
    }

    redirectAfterLogin(): void {
        if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
            this.clearReturnUrl();
            return;
        }

        const roles = this.userContext.roles;
        const fullName = this.userContext.fullName;
        const status = this.userContext.status;

        console.log('Redirecting, roles:', roles);
        console.log('Redirecting, fullName:', fullName);
        console.log('Redirecting, status:', status);

        if (roles.includes('Admin')) {
            this.router.navigateByUrl('/admin/dashboard');
        } else {
            if (status === '0') {
                this.router.navigateByUrl('/profile');
            } else {
                this.router.navigateByUrl('/home');
            }
        }
    }
}