import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GridShapeComponent } from '../../components/common/grid-shape/grid-shape.component';
import { RouterModule } from '@angular/router';
import { ThemeToggleTwoComponent } from '../../components/common/theme-toggle-two/theme-toggle-two.component';

@Component({
  selector: 'app-auth-page-layout',
  imports: [
    GridShapeComponent,
    RouterModule,
    ThemeToggleTwoComponent,
  ],
  templateUrl: './auth-page-layout.component.html',
  styles: ``
})
export class AuthPageLayoutComponent {
  roleHomeLink: string = '/';

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      const role = user?.role ?? null;
      const normalized = role === 'customer' ? 'user' : role;
      switch (normalized) {
        case 'admin':
          this.roleHomeLink = '/pub/admin';
          break;
        case 'master':
          this.roleHomeLink = '/pub/master';
          break;
        case 'waiter':
          this.roleHomeLink = '/pub/waiter';
          break;
        case 'manager':
        case 'user':
          this.roleHomeLink = '/events/home-default';
          break;
        default:
          this.roleHomeLink = '/';
      }
    });
  }
}
