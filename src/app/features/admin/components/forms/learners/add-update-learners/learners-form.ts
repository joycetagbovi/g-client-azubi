import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LearnerFormDto } from '../../../../../../shared/models/models';
import { FormInput } from '../../../../../../shared/components/form-input/form-input';

@Component({
    selector: 'app-learner-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInput],
    templateUrl: './learner-form.html',
    styleUrl: './learner-form.css'
})
export class LearnerForm implements OnInit, OnChanges {
    @Input() mode: 'add' | 'update' = 'add';
    @Input() learner: LearnerFormDto | null = null;
    @Output() onSubmit = new EventEmitter<{ formData: FormData, learnerData: LearnerFormDto }>();
    
    learnerForm!: FormGroup;
    selectedFile: File | null = null;
    isLoading: boolean = false;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['mode']) {
            this.initializeForm();
        }
        if (changes['learner'] && this.learner && this.mode === 'update') {
            this.populateForm(this.learner);
        }
    }

     initializeForm(): void {
        this.learnerForm = this.fb.group({
            firstName: ['', [Validators.required]],
            description: ['', [Validators.required]],
            location: ['', [Validators.required]],
            contact: ['', [Validators.required]],
            disabled: [false],
            profileImage: [null]
        });
    }

     populateForm(learner: LearnerFormDto): void {
        this.learnerForm.patchValue({
            firstName: learner.firstName || '',
            description: learner.description || '',
            location: learner.location || '',
            contact: learner.contact || '',
            disabled: learner.disabled || false
        });
    }


    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
        } else {
            this.selectedFile = null;
        }
    }

     onFormSubmit(): void {
        if (this.learnerForm.valid) {
            this.isLoading = true;
            const formData = new FormData();
            const learnerData = this.learnerForm.value as LearnerFormDto;
            formData.append('firstName', learnerData.firstName);
            formData.append('description', learnerData.description);
            formData.append('location', learnerData.location);
            formData.append('contact', learnerData.contact);
            formData.append('disabled', String(learnerData.disabled));
            if (this.selectedFile) {
                formData.append('profileImage', this.selectedFile, this.selectedFile.name);
            }

            this.onSubmit.emit({ formData, learnerData });
        }
    }


    stopLoading(): void {
        this.isLoading = false;
    }
}