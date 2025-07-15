import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-admin-auth-layout',
  imports: [RouterOutlet,  CommonModule],
  templateUrl: './admin-auth-layout.html',
  styleUrl: './admin-auth-layout.css'
})
export class AdminAuthLayout {

}
