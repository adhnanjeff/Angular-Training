import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'', redirectTo: 'home', pathMatch: 'full' },
    {path: 'home', loadComponent: () => import ('./pages/home/home').then(c => c.HomeComponent) },
    {path: 'about', loadComponent: () => import ('./pages/about/about').then(c => c.AboutComponent) },
    {path: 'projects', loadComponent: () => import ('./pages/projects/projects').then(c => c.ProjectsComponent) },
    {path: 'contact', loadComponent: () => import ('./pages/contact/contact').then(c => c.ContactComponent) },
    {path: '**', redirectTo: 'home'}
];
