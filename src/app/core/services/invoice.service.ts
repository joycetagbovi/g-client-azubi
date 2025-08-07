import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Invoice, InvoiceFormDto } from '../../shared/models/models';



@Injectable({ providedIn: 'root' })
export class InvoiceService {
    private baseUrl = '/invoices';

    constructor(private apiService: ApiService) { }

    getInvoices(): Observable<Invoice[]> {
      return this.apiService.get<any>(this.baseUrl).pipe(
            tap(response => {
                const res = response as any;
                // console.log('invoicesService: Raw API response:', res);
           
            }),
            map(res => {
                const response = res as any;
                // Try different ways to access the invoicess
                if (response.data?.invoices) {
                    return response.data.invoices;
                } else if (response.invoices) {
                    return response.invoices;
                } else if (Array.isArray(response.invoices)) {
                    return response.invoices
                } else {
                    console.warn('invoicesService: Could not find invoicess in response:', response);
                    return [];
                }
            }),
            catchError(error => {
                console.error('invoicesService: Error fetching invoicess:', error);
                throw error;
            })
        );
    }

    getInvoiceById(id: string): Observable<Invoice> {
        return this.apiService.get<Invoice>(`${this.baseUrl}/${id}`).pipe(
                tap(response => {
                     const res = response as any;
                    console.log('invoicesService: Fetched invoices:', res);  
                }),
        
                map(res => {
                    const response = res as any;
                    if (response.data?.invoice) {
                        return response.data.invoice;
                    } else  if (response.invoice) {
                        return response.invoice;
                    }else {
                        console.warn('invoicesService: Could not find invoices in response:', response);
                        throw new Error(response.message || 'invoices not found');
                    }
                }),
                catchError(error => {
                    console.error('invoicesService: Error fetching invoices:', error);
                    throw error;
                })
            );
    }

    addInvoice(invoice: InvoiceFormDto): Observable<Invoice> {
        return this.apiService.post<Invoice>(this.baseUrl, invoice).pipe(map(res => res.data!));
    }

    updateInvoice(id: string, invoice: InvoiceFormDto): Observable<Invoice> {
        return this.apiService.put<Invoice>(`${this.baseUrl}/${id}`, invoice).pipe(map(res => res.data!));
    }

    deleteInvoice(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
    }
}