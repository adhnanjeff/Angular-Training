import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  message: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(usernameInput: any, passwordInput: any) {
    if (usernameInput.value && passwordInput.value) {
      this.isLoading = true;
      this.message = 'Logging in...';
      
      this.authService.login(usernameInput.value, passwordInput.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.message = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        },
        error: (error) => {
          this.message = 'Login failed. Please check your credentials.';
          this.isLoading = false;
          console.error('Login error:', error);
        }
      });
    } else {
      this.message = 'Please enter both username and password';
    }
  }
}

 