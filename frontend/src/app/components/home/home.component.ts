import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h1>Welcome to Some very new</h1>

      <div class="hero-section">
        <p>A full-stack starter application with authentication built in.</p>

        <div class="auth-section" *ngIf="!(authService.isAuthenticated$ | async); else loggedIn">
          <h2>Get Started</h2>
          <p>Sign in to access your profile and protected features.</p>
          <button class="login-btn" (click)="login()">
            🔐 Login with Auth0
          </button>
        </div>

        <ng-template #loggedIn>
          <div class="welcome-back">
            <h2>Welcome back!</h2>
            <p>You are successfully logged in.</p>
            <div class="user-actions">
              <a href="/profile" class="profile-btn">View Profile</a>
              <button class="logout-btn" (click)="logout()">Logout</button>
            </div>
          </div>
        </ng-template>
      </div>

      <div class="features">
        <h3>Features</h3>
        <ul>
          <li>🔐 Auth0 Authentication</li>
          <li>🅰️ Angular Frontend</li>
          <li>🐦 NestJS Backend</li>
          <li>🔒 Protected Routes</li>
          <li>📱 Responsive Design</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .hero-section {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .auth-section {
      margin: 2rem 0;
    }

    .login-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .login-btn:hover {
      background: #0056b3;
    }

    .welcome-back {
      color: #28a745;
    }

    .user-actions {
      margin-top: 1rem;
    }

    .profile-btn {
      background: #28a745;
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      margin-right: 1rem;
      display: inline-block;
    }

    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }

    .features {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .features ul {
      list-style: none;
      padding: 0;
    }

    .features li {
      margin: 0.5rem 0;
      font-size: 18px;
    }
  `]
})
export class HomeComponent {
  constructor(public authService: AuthService) {}

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}
