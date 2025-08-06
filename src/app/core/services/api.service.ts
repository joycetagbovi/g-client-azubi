import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { env } from '../../../env/env';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = env.apiUrl;

    constructor(private http: HttpClient) {
        console.log(`API Service initialized with base URL: ${this.baseUrl}`);
    }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();

        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // GET request
    get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined) {
                    httpParams = httpParams.set(key, params[key]);
                }
            });
        }

        return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders(),
            params: httpParams
        }).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    // POST request
    post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    // PUT request
    put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    // PATCH request
    patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data, {
            headers: this.getHeaders()
        }).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    // DELETE request
    delete<T>(endpoint: string): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, {
            headers: this.getHeaders()
        }).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    // File upload
    uploadFile<T>(endpoint: string, file: File, additionalData?: any): Observable<ApiResponse<T>> {
        const formData = new FormData();
        formData.append('file', file);

        if (additionalData) {
            Object.keys(additionalData).forEach(key => {
                formData.append(key, additionalData[key]);
            });
        }

        const headers = new HttpHeaders();
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, formData, {
            headers
        }).pipe(
            retry(1),
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = error.status
                ? `Error Code: ${error.status}\nMessage: ${error.message}`
                : 'Server error';
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
} 