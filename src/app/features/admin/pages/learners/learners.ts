import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AllLearner } from '../../../../shared/models/models';
import { LearnerService } from '../../../../core/services/learner.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Navbar } from '../../components/navbar/navbar';
import { firstValueFrom } from 'rxjs';
import { TableModule } from 'primeng/table';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { DialogModule } from 'primeng/dialog';
import { ViewLearners } from '../../components/forms/learners/view-learners/view-learners';

@Component({
  selector: 'app-learners',
  standalone: true,
  imports: [CommonModule, Navbar,  DialogModule, TableModule, DateFormatPipe, ViewLearners],
  templateUrl: './learners.html',
  styleUrls: ['./learners.css'],
  providers: [DateFormatPipe]
})
export class Learners implements OnInit {
  searchValue = signal('');
  allLearners = signal<AllLearner[]>([]);
  loading = signal(false);
  selectedLearner = signal<AllLearner | null>(null);
  isDialogVisible = signal(false);

  filteredLearners = computed(() => {
    const filter = this.searchValue().toLowerCase().trim();
    const learners = this.allLearners();

    if (!filter) {
      return learners;
    }
    return learners.filter(
      (learner) =>
        learner.firstName?.toLowerCase().includes(filter) ||
        learner.lastName?.toLowerCase().includes(filter) ||
        learner.contact?.toLowerCase().includes(filter) ||
        learner.email?.toLowerCase().includes(filter)
    );
  });

  constructor(
    private learnerService: LearnerService,
    private router: Router,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.loadLearners();
  }

    handleDialogVisibility(isVisible: boolean) {
    this.isDialogVisible.set(isVisible);
  }

  async loadLearners(): Promise<void> {
    this.loading.set(true);
    try {
      const learners = await firstValueFrom(this.learnerService.getLearners());
      this.allLearners.set(learners as AllLearner[] || []);
    } catch (error) {
      console.error('Error loading learners', error);
      this.toastService.error('Failed to load learners');
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value.trim());
  }

  async viewLearner(learner: AllLearner): Promise<void> {
    this.loading.set(true);
    try {
      const detailedLearner = await firstValueFrom(this.learnerService.getLearnerById(learner._id));
      this.selectedLearner.set(detailedLearner as AllLearner);
      this.isDialogVisible.set(true);
    } catch (error) {
      console.error('Error fetching learner details', error);
      this.toastService.error('Failed to fetch learner details.');
    } finally {
      this.loading.set(false);
    }
  }

}