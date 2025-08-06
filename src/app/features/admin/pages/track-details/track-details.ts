import { Component, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackService } from '../../../../core/services/track.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Track, TrackFormDto } from '../../../../shared/models/models';
import { Navbar } from '../../components/navbar/navbar';
import { firstValueFrom } from 'rxjs';
import { TrackForm } from '../../components/forms/tracks/add-track/track-form';
import { ModalDialog } from '../../../../shared/components/modal-dialog/modal-dialog';

@Component({
    selector: 'app-track-details',
    standalone: true,
    imports: [CommonModule, Navbar, TrackForm, ModalDialog],
    templateUrl: './track-details.html',
    styleUrl: './track-details.css'
})
export class TrackDetails implements OnInit {
    @ViewChild(TrackForm) trackForm!: TrackForm;

    track = signal<Track | null>(null);
    loading = signal(false);
    error = signal(false);
    ratings = signal<Track['ratings']>([]);
    dialogVisible = signal(false);
    dialogTitle = signal('Update Track');
    dialogMode = signal<'add' | 'update'>('update');
    selectedTrack = signal<Track | undefined>(undefined);
    trackForForm = signal<TrackFormDto | null>(null);


    averageRating = computed(() => {
        const ratings = this.ratings();
        if (ratings.length === 0) {
            return 0;
        }
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        return Math.round(totalRating / ratings.length);
    });


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trackService: TrackService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.loadTrackDetails();
    }

    async loadTrackDetails(): Promise<void> {
        this.loading.set(true);
        this.error.set(false);

        const trackId = this.route.snapshot.paramMap.get('id');
        console.log('TrackDetails: Loading track with ID:', trackId);
        if (!trackId) {
            this.toastService.error('Track ID not found');
            this.router.navigate(['/admin/tracks']);
            return;
        }
        try {
            const track = await firstValueFrom(this.trackService.getTrackById(trackId));
            const ratings = await firstValueFrom(this.trackService.getRatingsByTrackId(trackId));
            this.track.set(track);
            this.ratings.set(ratings);
        }
        catch (error) {
            console.error('Error loading track details:', error);
            this.toastService.error('Failed to load track details');
            this.error.set(true);
        } finally {
            this.loading.set(false);
        }
    }

    
      onEditTrack(): void {
        const currentTrack = this.track();
        if (currentTrack) {
            // Prepare the form data
            const formData: TrackFormDto = {
                name: currentTrack.name,
                description: currentTrack.description,
                instructor: currentTrack.instructor,
                price: currentTrack.price,
                duration: currentTrack.duration,
                image: currentTrack.image
            };
        this.trackForForm.set(formData);
        this.dialogMode.set('update');
        this.dialogTitle.set('Update Track');
        this.dialogVisible.set(true);
        }
    }

    onDialogHide(): void {
        this.dialogVisible.set(false);
        this.trackForForm.set(null)
    }
        

  async onTrackFormSubmit(payload: { formData: FormData, trackData: TrackFormDto }): Promise<void> {
        const currentTrack = this.track();
        if (!currentTrack?.id) {
            this.toastService.error('Track ID not found');
            return;
        }
        try {
            const updatedTrack = await firstValueFrom(
                this.trackService.updateTrack(currentTrack.id, payload.formData)
            );
            
            this.track.set(updatedTrack);
            this.toastService.success('Track updated successfully!');
            this.dialogVisible.set(false);
            await this.loadTrackDetails();
        } catch (error) {
            console.error('Error updating track:', error);
            this.toastService.error('Failed to update track');
        }
    }

   async onDeleteTrack(): Promise<void> {
        const currentTrack = this.track();
        if (currentTrack?.id && confirm('Are you sure you want to delete this track?')) {
            try {
                await firstValueFrom(this.trackService.deleteTrack(currentTrack.id));
                this.toastService.success('Track deleted successfully!');
                await this.router.navigate(['/admin/tracks']);
            } catch (err) {
                console.error('Error deleting track:', err);
                this.toastService.error('Failed to delete track');
            }
        }
    }
} 