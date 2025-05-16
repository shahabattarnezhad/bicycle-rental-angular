import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'danger' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastSubject = new Subject<{ message: string, type: ToastType }>();
    toast$ = this.toastSubject.asObservable();

    showToast(message: string, type: ToastType = 'success') {
        this.toastSubject.next({ message, type });
    }
}