import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <a routerLink="/" class="brand-link">
            🚀 NestJS Angular Auth0
          </a>
        </div>

        <div class="nav-menu" [class.active]="isMenuOpen">
          <a routerLink="/home" routerLinkActive="active" class="nav-link">
            🏠 Home
          </a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">
            ℹ️ About
          </a>

          <div class="auth-section">
            <ng-container *ngIf="(authService.isAuthenticated$ | async); else notLoggedIn">
              <a routerLink="/profile" routerLinkActive="active" class="nav-link profile-link">
                👤 Profile
              </a>
              <button class="logout-btn" (click)="logout()">
                🔐 Logout
              </button>
            </ng-container>

            <ng-template #notLoggedIn>
              <button class="login-btn" (click)="login()">
                🔐 Login
              </button>
            </ng-template>
          </div>
        </div>

        <div class="hamburger" (click)="toggleMenu()" [class.active]="isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
    }

    .nav-brand .brand-link {
      font-size: 1.5rem;
      font-weight: bold;
      text-decoration: none;
      color: #007bff;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: #f8f9fa;
      color: #007bff;
    }

    .nav-link.active {
      background: #007bff;
      color: white;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .profile-link {
      background: #28a745;
      color: white !important;
    }

    .profile-link:hover {
      background: #218838 !important;
    }

    .login-btn, .logout-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .login-btn:hover {
      background: #0056b3;
    }

    .logout-btn {
      background: #dc3545;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .hamburger {
      display: none;
      flex-direction: column;
      cursor: pointer;
      padding: 4px;
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background: #333;
      margin: 3px 0;
      transition: 0.3s;
    }

    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        left: -100%;
        top: 60px;
        flex-direction: column;
        background-color: white;
        width: 100%;
        text-align: center;
        transition: 0.3s;
        box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
        padding: 2rem 0;
      }

      .nav-menu.active {
        left: 0;
      }

      .hamburger {
        display: flex;
      }

      .hamburger.active span:nth-child(2) {
        opacity: 0;
      }

      .hamburger.active span:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }

      .hamburger.active span:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }

      .auth-section {
        flex-direction: column;
        width: 100%;
        margin-top: 1rem;
      }
    }
  `]
})
export class NavigationComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  login(): void {
    this.authService.login();
    this.isMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.isMenuOpen = false;
  }
}