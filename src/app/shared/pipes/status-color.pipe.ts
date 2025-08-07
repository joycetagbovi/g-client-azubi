import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'statusColor',
    standalone: true,
})
export class StatusColorPipe implements PipeTransform {
      constructor(private sanitizer: DomSanitizer) {}

    transform(status: string): string {
        const lowerCaseStatus = status.toLowerCase();
        let backgroundColor: string;
        let textColor: string;

        switch (lowerCaseStatus) {
            case 'paid':
                backgroundColor = '#ECFDF3';
                textColor = '#027A48';
                break;
            case 'pending':
                backgroundColor = '#F2F4F7';
                textColor = '#344054';
                break;
            default:
                backgroundColor = 'gray';
                textColor = 'white';
                break;

        }
        return `
      <span style="
        background-color: ${backgroundColor}; 
        color: ${textColor}; 
        padding: 4px 8px; 
        border-radius: 4px;
      ">
        ${status}
      </span>
    `;
    }
}