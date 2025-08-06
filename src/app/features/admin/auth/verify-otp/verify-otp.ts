import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder , Validators} from '@angular/forms';
import { AuthService, RegisterRequest } from '../../../../core/services/auth.service';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import {CommonModule }from '@angular/common';
import { Router,ActivatedRoute, } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [FormInput, CommonModule,  ReactiveFormsModule],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class VerifyOtp implements OnInit {
  email: string = '';
  verifyToken!: FormGroup;
  errorMessage: string = '';
  isLoading= false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() : void {
   this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
   });

    // Initialize the form group with validation
      this.verifyToken = this.fb.group({
        token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onSubmit():void {
    if(this.verifyToken.invalid) {
      this.toastService.error('Please enter a valid OTP');
      return;
    }
      const token = this.verifyToken.get('token')?.value;
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.verifyEmail(token).subscribe({
        next: (response: any) => {
            this.toastService.success(response.message || 'OTP verified successfully!');
            this.isLoading = false;
            // Redirect to the dashboard 
            this.router.navigate(['/admin/dashboard']);
        },
        error: (error: any) => {
          this.errorMessage = error.message || 'An error occurred during verification.';
          this.toastService.error(this.errorMessage);
          this.isLoading = false;
        }
      });
    
  }

  resendOtp() {
  this.authService.resendVerificationEmail(this.email).subscribe({
    next: (response: any) => {
      this.toastService.success(response.message || 'OTP has been resent to your email.');
      this.isLoading = false;
    },
    error: (error: any) => {
      this.toastService.error(error.message || 'Failed to resend OTP.');
      this.isLoading = false;
    }
  });
  
  }

}
