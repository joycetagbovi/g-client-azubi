import { Component, signal, OnInit, computed, ViewChild,TemplateRef } from '@angular/core';
import { SearchAddBar } from '../../../../shared/components/search-add-bar/search-add-bar';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Invoice, InvoiceFormDto } from '../../../../shared/models/models';
import { InvoiceService } from '../../../../core/services/invoice.service';
import { ToastService } from '../../../../core/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { ModalDialog } from '../../../../shared/components/modal-dialog/modal-dialog';
import { Table, TableColumn } from '../../../../shared/components/table/table';
import { InvoiceForm } from '../../components/forms/invoices/add-update-invoices/invoice-form';
import { StatusColorPipe } from '../../../../shared/pipes/status-color.pipe';


@Component({
  selector: 'app-invoices',
  imports: [SearchAddBar, CommonModule, Navbar, InvoiceForm, ModalDialog, Table,StatusColorPipe,DateFormatPipe],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
  providers: [DateFormatPipe]
})
export class Invoices implements OnInit {
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('learnerTemplate', { static: true }) learnerTemplate!: TemplateRef<any>;
  @ViewChild('amountTemplate', { static: true }) amountTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>
  @ViewChild(InvoiceForm) courseForm!: InvoiceForm;

  searchValue = signal('');
  allInvoices = signal<Invoice[]>([]);
  loading = signal(false);
  dialogVisible = signal(false);
  dialogMode = signal<'add' | 'update'>('add');
  selectedInvoices = signal<Invoice | null>(null);


  dialogTitle = computed(() =>
    this.dialogMode() === 'add' ? 'Add New Invoice' : 'Update Invoice'
  );

  selectedInvoiceForForm = computed<InvoiceFormDto | null>(() => {
    const invoice = this.selectedInvoices();
    if (!invoice) {
      return null;
    }
    return {
      learner: invoice.learner._id,
      paystackCallbackUrl: invoice.paymentLink,
      amount: invoice.amount,
       dueDate: invoice.dueDate.split('T')[0], 
      status:invoice.status,
      paymentDetails: invoice.paymentDetails,
    };
  });

 
  filteredInvoices = computed(() => {
    const filter = this.searchValue().toLowerCase();
    const invoices = this.allInvoices();

    if (!filter) {
      return invoices;
    }
    return invoices.filter(
      (invoice) =>
        invoice.status.toLowerCase().includes(filter) ||
        invoice.learner.firstName.toLowerCase().includes(filter) ||
        this.dateFormatPipe.transform(invoice.dueDate).toLowerCase().includes(filter)

    );
  });

  
   get invoiceColumns(): TableColumn[] {
    return [
      { field: 'learner', header: 'Learners', bodyTemplate: this.learnerTemplate },
      { field: 'learner.email', header: 'Email address' },
      { field: 'dueDate', header: 'Due Date', bodyTemplate: this.dateTemplate },
      { field: 'amount', header: 'Amount', bodyTemplate: this.amountTemplate },
      { field: 'status', header: 'Status', bodyTemplate: this.statusTemplate },
    ];
  }

  constructor(
    private invoiceService: InvoiceService,
    private toastService: ToastService,
    private dateFormatPipe: DateFormatPipe,
    
  ) { }

  ngOnInit() {
    this.loadInvoices();
  }

  async loadInvoices(): Promise<void> {
    this.loading.set(true);
    try {
      const invoices = await firstValueFrom(this.invoiceService.getInvoices());
      this.allInvoices.set(invoices || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      this.toastService.error('Failed to load invoices');
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(value: string) {
    this.searchValue.set(value);
  }

  onAddInvoice() {
    this.selectedInvoices.set(null)
    this.dialogMode.set('add');
    this.dialogVisible.set(true);
  }

  async onEditInvoice(invoice: Invoice): Promise<void> {
    this.loading.set(true);
    try {
      const currentInvoice = await firstValueFrom(this.invoiceService.getInvoiceById(invoice._id));
      this.selectedInvoices.set(currentInvoice);
      this.dialogMode.set('update');
      this.dialogVisible.set(true);
    } catch (error) {
      this.toastService.error('Failed to load invoice for editing');
      console.error('Error fetching invoice for edit:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async onDeleteInvoice(invoice: Invoice): Promise<void> {
    if (!confirm(`Are you sure you want to delete ? `)) return;
    try {
      await firstValueFrom(this.invoiceService.deleteInvoice(invoice._id));
      this.allInvoices.update(invoices => invoices.filter(i => i._id !== invoice._id));
      this.toastService.success('Course deleted successfully');
      this.loadInvoices(); 
    } catch (error) {
      this.toastService.error('Failed to delete course');
      console.error('Delete error:', error);
    }
  }

  async onDialogSubmit(formValue: InvoiceFormDto): Promise<void> {
    this.loading.set(true);
    try {

      if (this.dialogMode() === 'add') {
        const newInvoices = await firstValueFrom(this.invoiceService.addInvoice(formValue));
        this.allInvoices.update(invoices => [...invoices, newInvoices]);
        this.toastService.success('Invoice added successfully');
      } else { // 'update' mode
        const invoiceId = this.selectedInvoices()?._id;
        if (!invoiceId) {
          throw new Error('Invoice ID is missing for update operation.');
        }

        const updatedInvoice = await firstValueFrom(
          this.invoiceService.updateInvoice(invoiceId, formValue)
        );
        this.allInvoices.update(invoices =>
          invoices.map(invoice => invoice._id === updatedInvoice?._id ? updatedInvoice : invoice)
        );
        this.toastService.success('Invoice updated successfully');
        await this.loadInvoices()
      }
    } catch (error) {
      this.toastService.error(`Failed to ${this.dialogMode()} invoice`);
      console.error('Submission error:', error);
    } finally {
      this.dialogVisible.set(false);
      this.selectedInvoices.set(null);
      this.loading.set(false);

    }
  }

  onDialogHide(): void {
    this.dialogVisible.set(false);
    this.selectedInvoices.set(null);
  }
}
