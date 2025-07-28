import { Component } from '@angular/core';
import { Sidebar } from '../../features/admin/components/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminHeaderComponent } from './admin-header.component';

@Component({
  selector: 'app-admin-layout',
  imports: [Sidebar, RouterOutlet, CommonModule, AdminHeaderComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
