import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { RouterLink,Router } from '@angular/router';
import {ReactiveFormsModule }from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

export interface LoginErrorResponse {
  success: boolean;
  errors: Array<{
    message: string;
  }>;
}

@Component({
  standalone: true,
  imports: [FormInput, RouterLink, ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
   loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastService.error('Please enter valid email and password.');
      return;
    }

    this.isLoading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login({email, password}).subscribe({
      next: (response:any) => {
        if (response.success) {
          this.toastService.success('Login successful!');
          this.authService.setAuth(response.user, response.token);
          this.router.navigate(['/admin/dashboard']);
        } else {
           const errorMessages = response.errors.map((error: { message: string }) => error.message).join('. ');
          this.toastService.error(errorMessages || 'Login failed. Please try again.');
        }
        this.isLoading = false;
      },
      error: (errorResponse: { error: LoginErrorResponse })=> {
        const errorMessage = errorResponse.error.errors?.[0]?.message ||
        'Something went wrong. Please try again.';
      this.toastService.error(errorMessage);
      this.isLoading = false;
      }
    });
  }

}
