import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ToastService } from '../services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                toastService.showToast('نام کاربری یا کلمه ی عبور نادرست است', 'danger');
                router.navigate(['/login']);
            } else if (error.error?.message) {
                toastService.showToast(error.error.message, 'danger');
            } else {
                toastService.showToast('خطای ناشناخته‌ای رخ داده است.', 'danger');
            }
            return throwError(() => error);
        })
    );
};