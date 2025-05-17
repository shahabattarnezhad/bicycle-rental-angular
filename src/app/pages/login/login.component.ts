import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { RedirectService } from '../../services/redirect.service';
import { LoginDto } from '../../models/LoginDto.model';


@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  redirect = inject(RedirectService);

  showPassword = false;
  isLoadinhg = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginHandler() {
    if (this.loginForm.invalid) return;
    this.isLoadinhg = true;

    const loginData = this.loginForm.value as LoginDto;

    this.authService.login(loginData).subscribe({
      next: (res) => {
        this.isLoadinhg = false;
        if (res.success && res.data) {
          this.loginForm.reset();

          this.redirect.redirectAfterLogin();
          this.redirect.clearReturnUrl();
        }
      },
      error: (err) => {
        this.isLoadinhg = false;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
