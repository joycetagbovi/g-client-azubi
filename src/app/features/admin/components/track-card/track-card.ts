import { Component,Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-track-card',
  imports: [FontAwesomeModule,CommonModule],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css'
})
export class TrackCard {
  faArrowUp = faArrowUp;
  @Input() image: string = '';
  @Input() name: string = '';
  @Input() description?: string = '';
  @Input() instructor?: string = '';
  @Input() price: string = '';
  @Input() duration: string = '';
  @Input() stacks: string[] = []

}
