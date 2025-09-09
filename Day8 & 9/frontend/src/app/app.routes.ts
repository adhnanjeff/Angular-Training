import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { BugsComponent } from './pages/bugs/bugs';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './unauthorized.component';
import { RoleGuard } from './guards/role.guard';
import { BugDetailComponent } from './bug-detail.component';
import { AdminDashboardComponent } from './admin-dashboard.component';

export const routes: Routes = [
    {path:'',redirectTo:'login',pathMatch:'full'},
    {path:'dashboard',component:DashboardComponent,title:'Dashboard',canActivate:[AuthGuard]},
    {path:'admin-dashboard',component:AdminDashboardComponent,title:'Admin Dashboard',canActivate:[AuthGuard, RoleGuard], data: { role: 'Admin' }},
    {path:'login',component:LoginComponent,title:'Login'},
    {path:'bugs',component:BugsComponent,title:'Bugs',canActivate:[AuthGuard]},
    {path:'bug/:id',component:BugDetailComponent,title:'Bug Details',canActivate:[AuthGuard]},
    {path:'unauthorized',component:UnauthorizedComponent,title:'Unauthorized'},
    {path:'**',redirectTo:'login',pathMatch:'full'}
];
