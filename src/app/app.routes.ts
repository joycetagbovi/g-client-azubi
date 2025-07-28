import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'admin', pathMatch: 'full' },
     {
    path: 'reset-password/:token',
    loadComponent: () => import('./features/admin/auth/reset-password/reset-password').then(c => c.ResetPassword)
  },
  
    { path: 'learner', loadComponent: () => import('./features/learner/learner').then(m => m.Learner) },
    { 
        path: 'admin', 
        loadChildren: () => import('./features/admin/admin.routes').then(r => r.adminRoutes) 
    },
    { path: '**', redirectTo: '' }
];
