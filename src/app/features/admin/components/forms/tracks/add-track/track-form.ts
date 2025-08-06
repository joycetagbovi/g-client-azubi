// track-form.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges,SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackFormDto } from '../../../../../../shared/models/models';
import { FormInput } from '../../../../../../shared/components/form-input/form-input';

@Component({
    selector: 'app-track-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInput],
    templateUrl: './track-form.html',
    styleUrl: './track-form.css'
})
export class TrackForm implements OnInit, OnChanges {
    @Input() mode: 'add' | 'update' = 'add';
    @Input() track: TrackFormDto | null = null;
    @Output() onSubmit = new EventEmitter<{ formData: FormData, trackData: TrackFormDto }>();
    trackForm!: FormGroup;
    selectedFile: File | null = null;
    isLoading: boolean = false; 

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
       
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['mode']) {
            this.initializeForm()
        }
        if (changes['track'] && this.track && this.mode === 'update') {
            this.populateForm(this.track);
        }
        
    }

    initializeForm(): void {
        this.trackForm = this.fb.group({
            name: ['', [Validators.required]],
            description: ['', [Validators.required]],
            instructor: ['', [Validators.required]],
            price: ['', [Validators.required, Validators.min(0)]],
            duration: ['', [Validators.required, Validators.min(1)]],
            image: [''] 
        });
    }

    populateForm(track: TrackFormDto): void {
        this.trackForm.patchValue({
            name: track.name || '',
            description: track.description || '',
            instructor: track.instructor || '',
            price: track.price || '',
            duration: track.duration || '',
            // image: track.image ||'' 
        });
    }

    isFormValid(): boolean {
        return this.trackForm.valid;
    }
    

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        } else {
            this.selectedFile = null;
        }
    }

    onFormSubmit(): void {
        if (this.trackForm.valid) {
            this.isLoading = true;
            const formData = new FormData();
            const trackData = this.trackForm.value as TrackFormDto;
            Object.keys(trackData).forEach(key => {
              if (trackData[key as keyof TrackFormDto] !== null && trackData[key as keyof TrackFormDto] !== undefined) {
                formData.append(key, String(trackData[key as keyof TrackFormDto]));
              }
            });
            if (this.selectedFile) {
                formData.append('image', this.selectedFile, this.selectedFile.name);
            }
            this.onSubmit.emit({ formData, trackData });
        }
    }

    stopLoading(): void {
        this.isLoading = false;
    }
}