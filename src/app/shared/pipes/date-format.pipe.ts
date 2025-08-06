import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    try {
      const date = new Date(value);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }

      // Format options for the desired output
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',  // Jan, Feb, Mar, etc.
        day: 'numeric',  // 1, 2, 3, etc. (no leading zero)
        year: 'numeric'  // 2022, 2023, etc.
      };

      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('DateFormatPipe: Error formatting date', error);
      return '';
    }
  }
}