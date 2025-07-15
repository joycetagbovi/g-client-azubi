import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormInput } from '../../../../shared/components/form-input/form-input';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  imports: [FormInput, RouterLink],
  styleUrl: './register.css'
})
export class Register {

}
