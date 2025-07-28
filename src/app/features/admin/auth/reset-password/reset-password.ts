import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { RouterLink,Router , ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormInput, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  isPassword: boolean = false;
  isConfirmPassword: boolean = false;
  isLoading: boolean = false;
  resetForm!: FormGroup;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
     private route: ActivatedRoute,
  ) { }

  viewPassword() {
    this.isPassword = !this.isPassword;
  }

  viewConfirmPassword() {
    this.isConfirmPassword = !this.isConfirmPassword;
  }

  get f() {
    return this.resetForm.controls;
  }

    ngOnInit(): void {
      this.token = this.route.snapshot.paramMap.get('token') || '';

    if (!this.token) {
      this.toastService.error('Invalid or missing token.');
      this.router.navigate(['/admin/auth/forgot-password']);
      return;
    }

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator for password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDontMatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      this.toastService.error('Please fill in all fields correctly.');
      return;
    }
    this.isLoading = true;
  const resetData = {
  token: this.token,
  ...this.resetForm.value
};
    this.authService.setNewPassword(resetData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastService.success('Password reset successful! You can now log in with your new password.');
          this.router.navigate(['/admin/auth/login']);
        } else {
          this.toastService.error(response.message || 'Password reset failed. Please try again.');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.toastService.error(error.message || 'An error occurred during password reset.');
        this.isLoading = false;
      }
    });
  }

}
