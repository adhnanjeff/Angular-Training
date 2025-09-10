import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  message: string = '';
  isLoading: boolean = false;
  isRegisterMode: boolean = false;
  
  loginData = { username: '', password: '' };
  registerData = { username: '', password: '', role: 'Developer' };
  
  roles = ['Admin', 'Developer', 'Tester'];

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.message = '';
    this.loginData = { username: '', password: '' };
    this.registerData = { username: '', password: '', role: 'Developer' };
  }

  login() {
    if (this.loginData.username && this.loginData.password) {
      this.isLoading = true;
      this.message = 'Logging in...';
      
      this.authService.login(this.loginData.username, this.loginData.password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.message = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: () => {
          this.isLoading = false;
          this.message = '';
        }
      });
    } else {
      this.message = 'Please enter both username and password';
    }
  }

  register() {
    if (this.registerData.username && this.registerData.password && this.registerData.role) {
      this.isLoading = true;
      this.message = 'Creating account...';
      
      this.authService.register(this.registerData.username, this.registerData.password, this.registerData.role).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.message = 'Registration successful! You can now login.';
          setTimeout(() => {
            this.isRegisterMode = false;
            this.registerData = { username: '', password: '', role: 'Developer' };
          }, 2000);
        },
        error: () => {
          this.isLoading = false;
          this.message = '';
        }
      });
    } else {
      this.message = 'Please fill in all fields';
    }
  }
}