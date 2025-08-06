import { Component, Input, Output, EventEmitter, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CourseFormDto, Track, Course } from '../../../../../../shared/models/models';
import { FormInput } from '../../../../../../shared/components/form-input/form-input';
import { TrackService } from '../../../../../../core/services/track.service';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../../../core/services/toast.service';

@Component({
    selector: 'app-course-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInput],
    templateUrl: './course-form.html',
    styleUrl: './course-form.css'
})
export class CourseForm implements OnInit,OnChanges {
    @Input() mode: 'add' | 'update' = 'add';
    @Input() course: CourseFormDto | null = null;
    @Output() onSubmit = new EventEmitter<{ formData: FormData; courseData: CourseFormDto }>();
 
    courseForm!: FormGroup;
    tracks = signal<Track[]>([]);
    loading = signal(false);
    currentImageUrl = signal<string | null>(null);
    selectedTrackName = signal<string | null>(null);
    isLoading = false;
 
    constructor(
        private fb: FormBuilder,
        private trackService: TrackService,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.loadTracks();
        this.setupFormValueChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['course'] && changes['course'].currentValue && this.mode === 'update') {
      this.populateForm(changes['course'].currentValue);
    }
  }


    initializeForm(): void {
        this.courseForm = this.fb.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            track: ['', [Validators.required]],
            image: ['', [Validators.required]]
        });
    }

    populateForm(course: CourseFormDto): void {
        this.courseForm.patchValue({
            title: course.title || '',
            track: course.track || '',
            description: course.description || ''
        });  
           if (course.image) {
            this.currentImageUrl.set(course.image);
        }
        if(course.track) {
             const trackName = this.getTrackName(course.track);
            this.selectedTrackName.set(trackName)
        }
        this.courseForm.get('image')?.setValue(null);
    }

      
  setupFormValueChanges(): void {
    this.courseForm.get('track')?.valueChanges.subscribe(trackId => {
      if (trackId) {
        const trackName = this.getTrackName(trackId);
        this.selectedTrackName.set(trackName); 
        console.log('Selected track:', trackName);
      } else {
        this.selectedTrackName.set(null);
      }
    });
  }


      async loadTracks(): Promise<void> {
        this.loading.set(true);
        try {
          const tracks = await firstValueFrom(this.trackService.getTracks());
          this.tracks.set(tracks || []);
          if(this.course && this.course.track && this.mode === 'update') {
            const trackName = this.getTrackName(this.course.track)
            this.selectedTrackName.set(trackName)
          }
        } catch (error) {
          console.error('Error loading tracks:', error);
          this.toastService.error('Failed to load tracks');
        } finally {
          this.loading.set(false);
        }
      }

    isFormValid(): boolean {
        return this.courseForm.valid;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.courseForm.get('image')?.setValue(file);
            this.courseForm.get('image')?.markAsDirty();
            this.courseForm.get('image')?.updateValueAndValidity();
        } else {
            this.courseForm.get('image')?.setValue(null);
        }
    }

    getFormValue(): CourseFormDto {
        return this.courseForm.value;
    }

    onFormSubmit(): void {
    if (this.courseForm.valid) {
        const formData = new FormData();
        const courseData = this.courseForm.getRawValue() as CourseFormDto;
        
        Object.keys(courseData).forEach(key => {
            if (key !== 'image' && courseData[key as keyof CourseFormDto] !== null) {
                formData.append(key, String(courseData[key as keyof CourseFormDto]));
            }
        });

        const imageValue = this.courseForm.get('image')?.value;
        if (imageValue instanceof File) {
            formData.append('image', imageValue, imageValue.name);
        }
        this.onSubmit.emit({ formData, courseData });
    }
}

    

    getTrackName(trackId: string): string {
    return this.tracks().find(t => t._id === trackId)?.name || 'Unknown Track';
  }

  stopLoading():void {
    this.isLoading = false;
  }
 
}