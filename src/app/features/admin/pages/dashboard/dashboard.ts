import { Component } from '@angular/core';
import {Navbar} from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import {TrackCard} from '../../components/track-card/track-card';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, CommonModule, TrackCard, FontAwesomeModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  faArrowUp = faArrowUp;
   invoices = [
    {
      profile: { name: 'John Doe', image: '/assets/profiles/john.jpg' },
      amount: '$200'
    },
    {
      profile: { name: 'Jane Smith', image: '/assets/profiles/jane.jpg' },
      amount: '$300'
    },
    {
      profile: { name: 'Alice Johnson', image: '/assets/profiles/alice.jpg' },
      amount: '$150'
    }
  ];

  constructor() {
    // Initialization logic can go here
  }

}
