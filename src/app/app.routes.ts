import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'learner', pathMatch: 'full' },
    { path: 'learner', loadComponent: () => import('./features/learner/learner').then(m => m.Learner) },
    { 
        path: 'admin', 
        loadChildren: () => import('./features/admin/admin.routes').then(r => r.adminRoutes) 
    },
    { path: '**', redirectTo: '' }
];
