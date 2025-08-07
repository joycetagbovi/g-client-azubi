import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
// import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe'; // Assuming you have a SafeHtmlPipe for innerHTML

export interface TableColumn {
  field: string;
  header: string;
  isImage?: boolean;
  showTitle?: boolean;
  displayWithImage?: string;
  sortable?: boolean;
  style?: { [key: string]: string };
  bodyTemplate?: TemplateRef<any>; 
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './table.html',
  styleUrl: './table.css'
})
export class Table {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() rows: number = 10;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();


  getNestedValue(item: any, field: string): any {
    return field?.split('.').reduce((obj, key) => obj ? obj[key] : undefined, item);
  }

  handleEdit(item: any): void {
    this.onEdit.emit(item);
  }

  handleDelete(item: any): void {
    this.onDelete.emit(item);
  }

  isTemplateRef(value: any): value is TemplateRef<any> {
    return value instanceof TemplateRef;
  }
}