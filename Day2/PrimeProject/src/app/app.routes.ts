import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent), title: 'Dashboard'},
    {path: 'bugs', loadComponent: () => import('./pages/bugs/bugs').then(m => m.BugsComponent), title: 'Bugs'},
    {path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent), title: 'Login'},
    {path: '**', redirectTo: 'dashboard' }
];
