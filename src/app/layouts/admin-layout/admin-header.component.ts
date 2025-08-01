import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-admin-header',
    templateUrl: './admin-header.component.html',
    styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
    @Input() title: string = '';
    @Input() paragraph: string = '';
} 