import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent), title: 'Dashboard', canActivate: [AuthGuard]},
    {path: 'bugs', loadComponent: () => import('./pages/bugs/bugs').then(m => m.BugsComponent), title: 'Bugs', canActivate: [AuthGuard, RoleGuard('Admin')]},
    {path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent), title: 'Login'},
    {path: 'unauthorized', loadComponent: () => import('./unauthorized').then(m => m.UnauthorizedComponent), title: 'Unauthorized'},    
    {path: '**', redirectTo: 'dashboard' }
];
