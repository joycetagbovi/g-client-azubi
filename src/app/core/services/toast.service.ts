import { Injectable } from '@angular/core';
import { MessageService, } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private messageService: MessageService) {}

    success(message: string, severity: 'success' | 'info' | 'warn' | 'error' = 'success') {
        this.messageService.add({ severity, summary: message, life: 3000 });
    }

    error(message: string, severity: 'success' | 'info' | 'warn' | 'error' = 'error') {
        this.messageService.add({ severity, summary: message, life: 3000 });
    }

    info(message: string, severity: 'success' | 'info' | 'warn' | 'error' = 'info') {
        this.messageService.add({ severity, summary: message, life: 3000 });
    }
    warn(message: string, severity: 'success' | 'info' | 'warn' | 'error' = 'warn') {
        this.messageService.add({ severity, summary: message, life: 3000 });
    }

    clear() {
        this.messageService.clear();
    }

}
