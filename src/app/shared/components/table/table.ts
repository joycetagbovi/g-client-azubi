import { Component , Input, Output, EventEmitter,TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import {ButtonModule} from 'primeng/button';

export interface TableColumn {
  field: string;
  header: string;
  isImage?: boolean; 
  showTitle?: boolean;
  displayWithImage?: string; 
  sortable?: boolean;
  style?: { [key: string]: string };
  body?: (item: any) => string | TemplateRef<any>;
}

@Component({
  selector: 'app-table',
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
    return field?.split('.').reduce((obj, key) => obj ? obj[key] : '', item);
  }

   handleEdit(item: any): void {
    this.onEdit.emit(item);
  }

  handleDelete(item: any): void {
    this.onDelete.emit(item);
  }

}





   

