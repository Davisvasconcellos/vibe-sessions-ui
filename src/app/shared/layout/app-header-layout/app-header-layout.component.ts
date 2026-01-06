import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '../app-header/app-header.component';

@Component({
  selector: 'app-header-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppHeaderComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <!-- app header start -->
      <app-header [showSidebarToggle]="false"/>
      <!-- app header end -->
      <div class="flex-1 p-4 mx-auto w-full max-w-(--breakpoint-2xl) md:p-6">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppHeaderLayoutComponent {}
