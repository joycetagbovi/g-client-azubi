import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const requiredRoles = next.data['roles'] as Array<string>;
    if (!requiredRoles) {
      return true;
    }

    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user || !requiredRoles.includes(user.role)) {
          this.router.navigate(['/admin/auth/login']);
          return false;
        }
        return true;
      })
    );
  }
}