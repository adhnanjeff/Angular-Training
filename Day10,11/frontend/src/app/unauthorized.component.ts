import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <i class="pi pi-lock" style="font-size: 4rem; color: #e74c3c; margin-bottom: 1rem;"></i>
        <h2>Access Denied</h2>
        <p>You need to be logged in to access this page.</p>
        <a routerLink="/login" class="login-link">Go to Login</a>
      </div>
    </div>`,
    styles: [`
      .unauthorized-container {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }
      .unauthorized-card {
        background: white;
        padding: 3rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 400px;
      }
      .unauthorized-card h2 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }
      .unauthorized-card p {
        color: #7f8c8d;
        margin-bottom: 2rem;
      }
      .login-link {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 0.75rem 2rem;
        text-decoration: none;
        border-radius: 25px;
        font-weight: 600;
        transition: transform 0.2s ease;
      }
      .login-link:hover {
        transform: translateY(-2px);
      }
    `]
})
export class UnauthorizedComponent {}
