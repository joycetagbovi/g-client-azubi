import { Routes } from '@angular/router';
import { AdminAuthLayout } from '../../../layouts/admin-auth-layout/admin-auth-layout';

export const authRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('../../../layouts/admin-auth-layout/admin-auth-layout').then(c => c.AdminAuthLayout),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./login/login').then(c => c.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./register/register').then(c => c.Register)
            },
                {
                path: 'forgot-password',
                loadComponent: () => import('./forgot-password/forgot-password').then(c => c.ForgotPassword)
            },
            // {
            //     path: 'reset-password/:token',
            //     loadComponent: () => import('./reset-password/reset-password').then(c => c.ResetPassword)
            // },
            {
                path: 'otp-verification',
                loadComponent: () => import('./verify-otp/verify-otp').then(c => c.VerifyOtp)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },



];

