import { Component } from '@angular/core';
import { Navbar} from '../../components/navbar/navbar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {FormInput} from '../../../../shared/components/form-input/form-input';

@Component({
  selector: 'app-update-profile',
  imports: [Navbar,ReactiveFormsModule, CommonModule, FormInput],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css'
})

export class UpdateProfile {
  profileForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      image: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contact: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required]]
    },{validators: this.passwordsMatchValidator });


  }


  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;
    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.profileForm.patchValue({ image: this.selectedFile });
    }
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      // Handle profile update logic here
      // e.g., send FormData to API
    }
  }


}