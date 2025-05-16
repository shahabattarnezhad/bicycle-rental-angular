import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
                alert('نام کاربری یا کلمه ی عبور نادرست است');
                router.navigate(['/login']);
            } else if (error.error?.message) {
                alert(error.error.message)
            } else {
                alert('خطای ناشناخته‌ای رخ داده است.');
            }
            return throwError(() => error);
        })
    );
};