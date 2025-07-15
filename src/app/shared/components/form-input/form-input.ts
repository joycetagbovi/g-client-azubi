import { Component , Input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-input',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css'
})
export class FormInput {
@Input() label: string = '';
@Input() type: string = 'text';
@Input() placeholder: string = '';
@Input() control: FormControl = new FormControl();
@Input() required: boolean = false;
@Input() disabled: boolean = false;
@Input() readonly: boolean = false;


inputId: string = '';
helpText: string = '';
errorMessage: string = '';
value: string = '';

  get hasError(): boolean {
    return this.control ? this.control.invalid && (this.control.dirty || this.control.touched) : false;
  }


private onChange = (value: string) => {};

  onInput(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
  }
}
