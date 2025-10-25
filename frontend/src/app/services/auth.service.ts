import { Injectable } from '@angular/core';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0Client!: Auth0Client;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.initializeAuth0();
  }

  private async initializeAuth0(): Promise<void> {
    this.auth0Client = await createAuth0Client({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: environment.auth0.redirectUri,
        audience: environment.auth0.audience
      }
    });

    const isAuthenticated = await this.auth0Client.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      const user = await this.auth0Client.getUser();
      this.userSubject.next(user);
    }

    // Handle redirect callback
    if (window.location.search.includes('code=')) {
      await this.handleRedirectCallback();
    }
  }

  public login(): void {
    this.auth0Client.loginWithRedirect();
  }

  public async logout(): Promise<void> {
    await this.auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  private async handleRedirectCallback(): Promise<void> {
    await this.auth0Client.handleRedirectCallback();
    const isAuthenticated = await this.auth0Client.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      const user = await this.auth0Client.getUser();
      this.userSubject.next(user);

      // Sync user with backend database
      await this.syncUserWithBackend();
    }

    // Remove the code from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  private async syncUserWithBackend(): Promise<void> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${environment.apiUrl}/user/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to sync user with backend');
      }
    } catch (error) {
      console.error('Error syncing user with backend:', error);
    }
  }

  public async getAccessToken(): Promise<string> {
    return await this.auth0Client.getTokenSilently();
  }
}
