import { Routes } from '@angular/router';


export const adminRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(r => r.authRoutes)
      },

      {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
      }
    
];

