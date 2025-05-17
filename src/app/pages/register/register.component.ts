import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { RegisterDto } from '../../models/RegisterDto.model';
import { PasswordMatchValidator } from '../../validators/custom-validators';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);

  showPassword = false;
  isLoadinhg = false;

  registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: PasswordMatchValidator }
  );

  registerHandler() {
    if (this.registerForm.invalid) return;
    this.isLoadinhg = true;

    const registerData = this.registerForm.value as RegisterDto;

    this.authService.register(registerData).subscribe({
      next: (res) => {
        this.isLoadinhg = false;
        if (res.success && res.data) {
          this.registerForm.reset();
          this.router.navigate(['login']);
          this.toastService.showToast(res.message, 'success');
        }
      },
      error: (err) => {
        this.isLoadinhg = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
