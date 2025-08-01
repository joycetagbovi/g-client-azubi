import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormInput} from '../../../../shared/components/form-input/form-input';
import { env } from '../../../../../env/env';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule,CommonModule, RouterLink, FormInput],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword implements OnInit {
form!: FormGroup;
isLoading: boolean = false;

constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private authService: AuthService,
  ) { }

  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

    onSubmit() {
    if (this.form.invalid) {
      this.toastService.error('Please enter a valid email.');
      return;
    }

    this.isLoading = true;
    const email = this.form.get('email')?.value;
   const baseResetURL=  `${env.resetPasswordBaseUrl}/reset-password`;
    this.authService.requestPasswordReset({email, baseResetURL}).subscribe({
      next: (response) => {
        this.toastService.success(response.message || 'Password reset link sent successfully.');
        this.isLoading = false;
          // Redirect to reset-password page with the token
                this.router.navigate(['/reset-password']);
 
      },
      error: (err) => {
        console.error('Error sending reset link:', err);
        this.toastService.error(err.message || 'Failed to send reset link.');
        this.isLoading = false;
      }
    });
  }


 

}
