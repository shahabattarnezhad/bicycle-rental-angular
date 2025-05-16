import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserContextService } from '../services/user-context.service';
import { RedirectService } from '../services/redirect.service';

export const authGuard: CanActivateFn = (route, state) => {
    const userContext = inject(UserContextService);
    const router = inject(Router);
    const redirect = inject(RedirectService);

    if (!userContext.isAuthenticated) {
        redirect.setReturnUrl(state.url);
        router.navigate(['/login']);
        return false;
    }

    if (userContext.status === '0') {
        router.navigate(['/pages/pending']);
        return false;
    }

    return true;
};