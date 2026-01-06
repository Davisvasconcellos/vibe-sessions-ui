import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          // Usuário está logado, redireciona para sua página home
          this.redirectToUserHome(user.role);
          return false;
        }
        
        // Usuário não está logado, pode acessar a rota
        return true;
      })
    );
  }

  private redirectToUserHome(role: string): void {
    const roleRoutes: { [key: string]: string } = {
      'admin': '/pub/admin',
      'master': '/pub/master',
      'manager': '/events/home-default',
      'waiter': '/pub/waiter',
      'customer': '/events/home-default',
      'user': '/events/home-default'
    };

    const redirectRoute = roleRoutes[role] || '/dashboard';
    this.router.navigate([redirectRoute]);
  }
}