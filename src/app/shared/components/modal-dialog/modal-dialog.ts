import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-modal-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule],
    templateUrl: './modal-dialog.html',
    styleUrl: './modal-dialog.css',
})
export class ModalDialog {
    @Input() visible: boolean = false;
    @Input() title: string = '';
    @Input() mode: 'add' | 'update' = 'add';
    @Output() close = new EventEmitter<void>();
 

    onHide() {
        this.close.emit();
    }

 
}