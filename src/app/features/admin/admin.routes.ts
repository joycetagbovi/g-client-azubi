import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(r => r.authRoutes)
  },

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  {
    path: '',
    loadComponent: () => import('../../layouts/admin-layout/admin-layout').then(c => c.AdminLayout),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'courses',
        loadComponent: () => import('./pages/courses/courses').then(m => m.Courses)
      },
      {
        path: 'tracks',
        loadComponent: () => import('./pages/tracks/tracks').then(m => m.Tracks)
      },
      {
        path: 'tracks/:id',
        loadComponent: () => import('./pages/track-details/track-details').then(m => m.TrackDetails)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./pages/invoices/invoices').then(m => m.Invoices)
      },
      {
        path: 'learners',
        loadComponent: () => import('./pages/learners/learners').then(m => m.Learners)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports').then(m => m.Reports)
      }
    ]
  }

];

