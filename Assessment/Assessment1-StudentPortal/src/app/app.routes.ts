import { Routes } from '@angular/router';
import { StudentsComponent } from './pages/students/students';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
    {path:'',redirectTo:'register',pathMatch:'full'},
    {path:'register',component:RegisterComponent,title:'Register'},
    {path:'students',component:StudentsComponent,title:'Students'},
    {path:'**',redirectTo:'register',pathMatch:'full'}
];
