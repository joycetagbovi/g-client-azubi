import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormInput, RouterLink, FormsModule,CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {
  isResettingPassword: boolean = false;

    onSubmit() {
    if (!this.isResettingPassword) {
      // Step 1: Handle email submission
      console.log('Submitting email...');
      this.isResettingPassword = true;
    } else {
      // Step 2: Handle password reset
      console.log('Setting new password...');
    }
  }

}
