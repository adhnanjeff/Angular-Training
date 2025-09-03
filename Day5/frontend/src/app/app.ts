import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
  CommonModule,
  RouterOutlet,
  RouterLink,
  DrawerModule,
  ButtonModule,
  MenubarModule,
  CardModule
],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = signal('PrimeProject');
  sidebarVisible = false;
  currentRoute = '';

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
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // update route on every navigation
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hideNavbar(): boolean {
    return this.currentRoute === '/login'; // 👈 hide menubar on login
  }
}
