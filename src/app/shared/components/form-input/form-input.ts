import { Component , Input, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
   standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInput),
      multi: true
    }
  ]
})
export class FormInput implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() name: string = '';
  



  value: any = '';


  onChange: any = () => {};
  onTouched: any = () => {};

 

  writeValue(value: any): void {
    this.value = value || '';
  }
    registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }


 onInput(event: Event): void {
  const input = event.target as HTMLInputElement;
    let newValue = input.value;
    
    this.value = newValue;
    this.onChange(this.value);
    this.onTouched();
  }


}
