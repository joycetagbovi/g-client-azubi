import { Component, Input, Output, EventEmitter, OnInit, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceFormDto } from '../../../../../../shared/models/models';
import { FormInput } from '../../../../../../shared/components/form-input/form-input';
import { LearnerService } from '../../../../../../core/services/learner.service';
import { ToastService } from '../../../../../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-invoice-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormInput],
    templateUrl: './invoice-form.html',
    styleUrl: './invoice-form.css'
})
export class InvoiceForm implements OnInit, OnChanges {
    @Input() mode: 'add' | 'update' = 'add';
    @Input() invoice: InvoiceFormDto | null = null;
    @Output() onSubmit = new EventEmitter<InvoiceFormDto>();
    invoiceForm!: FormGroup;
    learners = signal<any>([])
    loadingLearners = signal(false)
    selectedLearner = signal<string | null>(null);
    isLoading = false

    constructor(
        private fb: FormBuilder,
        private learnerService: LearnerService,
        private toastService: ToastService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
        this.loadLearners();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['invoice'] && changes['invoice'].currentValue) {
            this.populateForm(changes['invoice'].currentValue);
        }
    }

    async loadLearners(): Promise<void> {
        this.loadingLearners.set(true)
        try {
            const learners = await firstValueFrom(this.learnerService.getLearners());
            console.log('check leaners', learners)
            this.learners.set(learners || [])
        } catch (error) {
            console.error('Error loading tracks:', error);
            this.toastService.error('Failed to load tracks')

        } finally {
            this.loadingLearners.set(false);
        }
    }


    initializeForm(): void {
        this.invoiceForm = this.fb.group({
            learner: ['', [Validators.required]],
                        amount: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
            dueDate: ['', [Validators.required]],
            status: [''],
            paystackCallbackUrl: ['http://localhost:4200/payment',],
            paymentDetails: ['', [Validators.required]],
        });
    }

    populateForm(invoice: InvoiceFormDto): void {
        this.invoiceForm.patchValue({
            learner: invoice.learner,
            amount: invoice.amount,
            dueDate: invoice.dueDate.split('T')[0],
            paystackCallbackUrl: invoice.paystackCallbackUrl,
            paymentDetails: invoice.paymentDetails,
      
        });
    }

    isFormValid(): boolean {
        return this.invoiceForm.valid;
    }

    getFormValue(): InvoiceFormDto {
        const formValue = this.invoiceForm.value;
        return {
            ...formValue,
            amount: Number(formValue.amount),
        }
    }

    onFormSubmit(): void {
        if (this.invoiceForm.valid) {
            this.onSubmit.emit(this.getFormValue());
        }
    }
}