import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterRequest, User } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../../shared/components/form-input/form-input';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [ReactiveFormsModule,CommonModule, FormInput, RouterLink]
})
export class Register {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isPasswordVisible = false;

  // Patterns
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
phonePattern = '^\\+233\\d{9}$';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      contact: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDontMatch: true };
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      const registerData: RegisterRequest = this.registerForm.value;
      this.authService.register(registerData).subscribe({
        next: (response : any) => {
          if (response.status === '201' || response?.success) {
             try{
              this.toastService.success(response.message || 'Registration successful!');
            this.authService.setAuth(response.user, response.token);
            setTimeout(() => {
              this.router.navigate(['/admin/auth/otp-verification'], {
                queryParams: { email: this.registerForm.get('email')?.value }
              });
            }, 2000);
             }   catch (error) {
              console.error('Error setting auth:', error);
              this.toastService.error('Registration successful, but failed to set authentication data.');
            }
           
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again.';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.toastService.error(error.error?.message || 'Registration failed. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.toastService.error('Please fill in all required fields correctly.');
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = new RegExp(this.emailPattern);
    return emailRegex.test(email);
  }

  isValidContact(contact: string): boolean {
    const phoneRegex = new RegExp(this.phonePattern);
    return phoneRegex.test(contact.replace(/\D/g, ''));
  }
}