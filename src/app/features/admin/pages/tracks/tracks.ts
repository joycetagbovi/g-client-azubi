import { Component, signal, ViewChild, OnInit, computed } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { CommonModule } from '@angular/common';
import { TrackCard } from '../../components/track-card/track-card';
import { SearchAddBar } from '../../../../shared/components/search-add-bar/search-add-bar';
import { ModalDialog } from '../../../../shared/components/modal-dialog/modal-dialog';
import { TrackForm } from '../../components/forms/tracks/add-track/track-form';
import { ToastService } from '../../../../core/services/toast.service';
import { TrackService } from '../../../../core/services/track.service';
import { Router } from '@angular/router';
import { Track, TrackFormDto } from '../../../../shared/models/models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tracks',
  standalone: true,
  imports: [TrackCard, Navbar, CommonModule, SearchAddBar, ModalDialog, TrackForm],
  templateUrl: './tracks.html',
  styleUrls: ['./tracks.css']
})
export class Tracks implements OnInit {
  @ViewChild(TrackForm) trackForm!: TrackForm;

  tracks = signal<Track[]>([]);
  searchValue = signal('');
  loading = signal(false);
  dialogVisible = signal(false);
  dialogTitle = signal('Add New Track');
  dialogMode = signal<'add' | 'update'>('add');
  selectedTrack = signal<Track | undefined>(undefined);


  filteredTracks = computed(() => {
    const searchTerm = this.searchValue().toLowerCase();
    if (!searchTerm) {
      return this.tracks();
    }
    return this.tracks().filter(track =>
      track.name.toLowerCase().includes(searchTerm) ||
      track.description?.toLowerCase().includes(searchTerm)
    );
  });

 
  selectedTrackFormDto = computed<TrackFormDto | null>(() => {
    const track = this.selectedTrack();
    if (!track) {
      return null;
    }
    return {
      name: track.name,
      description: track.description,
      image: track.image,
      duration: track.duration,
      price: track.price,
      instructor: track.instructor,
    };
  });

  constructor(
    private toastService: ToastService,
    private trackService: TrackService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTracks();
  }

  async loadTracks(): Promise<void> {
    this.loading.set(true);
    try {
      const tracks = await firstValueFrom(this.trackService.getTracks());
      this.tracks.set(tracks || []);
    } catch (error) {
      console.error('Error loading tracks:', error);
      this.toastService.error('Failed to load tracks');
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(value: string) {
    this.searchValue.set(value);
  }

  onAddTrack() {
    this.dialogMode.set('add');
    this.dialogTitle.set('Add New Track');
    this.selectedTrack.set(undefined);
    this.dialogVisible.set(true);
  }

  onDialogHide() {
    this.dialogVisible.set(false);
  }

 async onDialogSubmit(payload: { formData: FormData, trackData: TrackFormDto }): Promise<void> {
    if (!this.trackForm.isFormValid()) {
      this.toastService.error('Please fill all required fields correctly.');
      return;
    }
    if (this.dialogMode() === 'add') {
       console.warn('Attempted to create a track in non-add mode. Action aborted.');
      return
    }

    try {
        const newTrack = await firstValueFrom(this.trackService.addTrack(payload.formData));
        this.tracks.update(currentTracks => [...currentTracks, newTrack]);
        this.toastService.success('Track added successfully!');
        this.dialogVisible.set(false);
        await this.loadTracks()
      } 
   
     catch (error:any) {
      console.error('Error adding track:', error);
      const apiError = error?.errors?.[0]?.message;
    if (apiError === 'File too large') {
      this.toastService.error('Failed to add track: The image file is too large. Please select a smaller file. 🖼️');
    } else if (apiError) {
      this.toastService.error(`Failed to add track: ${apiError}`);
    } else {
      this.toastService.error('Failed to add track. Please try again. 🚫');
    }

    }finally {
      this.trackForm.stopLoading();
    }
  }


onViewTrack(track: Track): void {
  if (track?.id) {
    this.router.navigate(['/admin/tracks', track.id]);
  }
}

  
}