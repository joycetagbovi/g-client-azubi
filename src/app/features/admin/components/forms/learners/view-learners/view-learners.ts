import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllLearner } from '../../../../../../shared/models/models';

@Component({
  selector: 'app-view-learners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-learners.html',
  styleUrl: './view-learners.css'
})
export class ViewLearners {
  @Input() learner!: AllLearner | null;
}