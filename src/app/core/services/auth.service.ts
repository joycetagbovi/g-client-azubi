import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService, ApiResponse } from './api.service';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'learner';
    isEmailVerified?: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
    password: string;
    confirmPassword: string;
}

export interface ResetPasswordRequest {
    email: string;
    baseUrl: string;
}

export interface SetNewPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface VerifyOtpRequest {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private router: Router
    ) {
        this.initializeAuth();
    }

    private initializeAuth(): void {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('current_user');

        if (token && user) {
            try {
                const userData = JSON.parse(user);
                this.currentUserSubject.next(userData);
                this.isAuthenticatedSubject.next(true);
            } catch (error) {
                this.clearAuth();
            }
        }
    }

    // Login
    login(credentials: LoginRequest): Observable<ApiResponse<{ user: User; token: string }>> {
        return this.apiService.post<{ user: User; token: string }>('/auth/login', credentials);
    }

    // Register
    register(userData: RegisterRequest): Observable<ApiResponse<{ user: User; token: string }>> {
        return this.apiService.post<{ user: User; token: string }>('/auth/signup/admin', userData);
    }

    // Request password reset
    requestPasswordReset(data: ResetPasswordRequest): Observable<ApiResponse> {
        return this.apiService.post('/auth/forgot-password', data);
    }

    // Set new password
    setNewPassword(data: SetNewPasswordRequest): Observable<ApiResponse> {
        return this.apiService.post('/auth/reset-password', data);
    }

    // Verify OTP
    verifyOtp(data: VerifyOtpRequest): Observable<ApiResponse> {
        return this.apiService.post('/auth/verify-email', data);
    }

    // Logout
    logout(): void {
        this.clearAuth();
        this.router.navigate(['/admin/auth/login']);
    }

    //Set authentication data
    setAuth(user: User, token: string): void {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    // Clear authentication data
    clearAuth(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }

    // Check if user has specific role
    hasRole(role: 'admin' | 'learner'): boolean {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    // Check if user is admin
    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    // Check if user is learner
    isLearner(): boolean {
        return this.hasRole('learner');
    }

    // Get auth token
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    // Refresh token (if needed)
    refreshToken(): Observable<ApiResponse<{ token: string }>> {
        return this.apiService.post<{ token: string }>('/auth/refresh-token', {});
    }

    // Update user profile
    updateProfile(userData: Partial<User>): Observable<ApiResponse<User>> {
        return this.apiService.put<User>('/auth/profile', userData);
    }

    // Change password
    changePassword(data: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<ApiResponse> {
        return this.apiService.post('/auth/change-password', data);
    }

    // Verify email
    verifyEmail(token: string): Observable<ApiResponse> {
        return this.apiService.post('/auth/verify-email', { token });
    }

    // Resend verification email
    resendVerificationEmail(email: string): Observable<ApiResponse> {
        return this.apiService.post('/auth/resend-token', { email });
    }
} 