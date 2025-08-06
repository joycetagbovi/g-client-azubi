import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-search-add-bar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './search-add-bar.html',
    styleUrl: './search-add-bar.css',
})
export class SearchAddBar {
    @Input() placeholder: string = 'Search...';
    @Input() addLabel: string = 'Add';
    @Output() search = new EventEmitter<string>();
    @Output() add = new EventEmitter<void>();

    searchValue = signal('');

    onInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchValue.set(value);
        this.search.emit(value);
    }

    onAdd() {
        this.add.emit();
    }
} 