import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="profile-container">
      <h1>User Profile</h1>

      <div class="profile-content" *ngIf="(authService.isAuthenticated$ | async); else notAuthenticated">
        <div class="user-info" *ngIf="(authService.user$ | async) as user">
          <div class="avatar-section">
            <img [src]="user.picture" [alt]="user.name" class="avatar" *ngIf="user.picture">
            <div class="user-details">
              <h2>{{ user.name }}</h2>
              <p class="email">{{ user.email }}</p>
              <span class="verified" *ngIf="user.email_verified">✅ Email Verified</span>
            </div>
          </div>

          <div class="profile-sections">
            <div class="info-section">
              <h3>Account Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <strong>User ID:</strong>
                  <span>{{ user.sub }}</span>
                </div>
                <div class="info-item">
                  <strong>Nickname:</strong>
                  <span>{{ user.nickname || 'Not set' }}</span>
                </div>
                <div class="info-item">
                  <strong>Last Updated:</strong>
                  <span>{{ user.updated_at | date:'medium' }}</span>
                </div>
              </div>
            </div>

            <div class="api-section">
              <h3>API Access Test</h3>
              <button class="test-btn" (click)="testApiAccess()" [disabled]="isLoading">
                {{ isLoading ? 'Testing...' : 'Test Protected API' }}
              </button>

              <div class="api-result" *ngIf="apiResult">
                <h4>API Response:</h4>
                <pre>{{ apiResult | json }}</pre>
              </div>

              <div class="api-error" *ngIf="apiError">
                <h4>Error:</h4>
                <p>{{ apiError }}</p>
              </div>
            </div>
          </div>

          <div class="actions">
            <button class="logout-btn" (click)="logout()">
              🔐 Logout
            </button>
          </div>
        </div>
      </div>

      <ng-template #notAuthenticated>
        <div class="not-authenticated">
          <h2>🔒 Access Denied</h2>
          <p>You need to be logged in to view your profile.</p>
          <button class="login-btn" (click)="login()">
            🔐 Login
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
    }

    .profile-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .user-info {
      padding: 2rem;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 1.5rem;
      object-fit: cover;
    }

    .user-details h2 {
      margin: 0;
      color: #333;
    }

    .email {
      color: #666;
      margin: 0.5rem 0;
    }

    .verified {
      color: #28a745;
      font-size: 14px;
    }

    .profile-sections {
      display: grid;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .info-section, .api-section {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 6px;
    }

    .info-section h3, .api-section h3 {
      margin-top: 0;
      color: #007bff;
    }

    .info-grid {
      display: grid;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #ddd;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .test-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 1rem;
    }

    .test-btn:hover:not(:disabled) {
      background: #0056b3;
    }

    .test-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .api-result {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .api-error {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
    }

    pre {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 14px;
    }

    .actions {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #eee;
    }

    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .not-authenticated {
      text-align: center;
      padding: 3rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .login-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
    }

    .login-btn:hover {
      background: #0056b3;
    }

    @media (max-width: 768px) {
      .avatar-section {
        flex-direction: column;
        text-align: center;
      }

      .avatar {
        margin-right: 0;
        margin-bottom: 1rem;
      }

      .info-item {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  apiResult: any = null;
  apiError: string = '';
  isLoading = false;

  constructor(
    public authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  async testApiAccess(): Promise<void> {
    this.isLoading = true;
    this.apiResult = null;
    this.apiError = '';

    try {
      const token = await this.authService.getAccessToken();
      const headers = { Authorization: `Bearer ${token}` };

      this.apiResult = await this.http.get(`${environment.apiUrl}/user/profile`, { headers }).toPromise();
    } catch (error: any) {
      this.apiError = error.error?.message || error.message || 'Failed to access API';
    } finally {
      this.isLoading = false;
    }
  }

  login(): void {
    this.authService.login();
  }

  logout(): void {
    this.authService.logout();
  }
}