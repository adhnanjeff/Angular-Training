import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';  // ✅ add RouterLink & RouterLinkActive
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-root',
  standalone: true,   // ✅ make sure this is marked standalone
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,       // ✅ import RouterLink directive
    RouterLinkActive, // ✅ import RouterLinkActive directive
    DrawerModule,
    ButtonModule,
    MenubarModule,
    CardModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('PrimeProject');
  sidebarVisible = false;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Bugs',
      icon: 'bi bi-bug',
      routerLink: '/bugs'
    },
    {
      label : 'Login',
      icon: 'pi pi-fw pi-sign-in',
      routerLink: '/login'
    }
  ];
}
