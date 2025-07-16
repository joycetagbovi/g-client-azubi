import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormInput, RouterLink],
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
