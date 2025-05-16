import { NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { ToastService, ToastType } from '../../services/toast-service';

@Component({
  selector: 'app-toast-notification',
  imports: [NgIf],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.css'
})
export class ToastNotificationComponent implements OnDestroy {
  toastMessage: string | null = null;
  toastType: ToastType = 'success';
  toastTimeout: any = null;

  private toastSub: Subscription;

  constructor(private toastService: ToastService) {
    this.toastSub = this.toastService.toast$.subscribe(({ message, type }) => {
      this.showToast(message, type);
    });
  }

  showToast(message: string, type: ToastType = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => this.closeToast(), 4000);
  }

  closeToast() {
    this.toastMessage = null;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }

  ngOnDestroy() {
    this.toastSub.unsubscribe();
  }
}
