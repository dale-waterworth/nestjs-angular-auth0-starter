import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <h1>About This Project</h1>

      <div class="content-section">
        <h2>🚀 NestJS Angular Auth0 Starter</h2>
        <p>
          This is a full-stack starter application that demonstrates modern web development
          practices using TypeScript throughout the entire stack.
        </p>

        <div class="tech-stack">
          <h3>Technology Stack</h3>
          <div class="tech-grid">
            <div class="tech-item">
              <h4>🅰️ Frontend</h4>
              <ul>
                <li>Angular (Latest)</li>
                <li>TypeScript</li>
                <li>Auth0 SPA SDK</li>
                <li>Standalone Components</li>
              </ul>
            </div>
            <div class="tech-item">
              <h4>🐦 Backend</h4>
              <ul>
                <li>NestJS</li>
                <li>TypeScript</li>
                <li>JWT Authentication</li>
                <li>Auth0 Integration</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="features-section">
          <h3>Key Features</h3>
          <ul class="features-list">
            <li>🔐 Secure authentication with Auth0</li>
            <li>🏠 Public and protected routes</li>
            <li>👤 User profile management</li>
            <li>🔄 JWT token handling</li>
            <li>📱 Responsive design</li>
            <li>🎯 TypeScript best practices</li>
            <li>🚀 One-click build and deployment</li>
            <li>📦 FTP deployment ready</li>
          </ul>
        </div>

        <div class="getting-started">
          <h3>Getting Started</h3>
          <ol>
            <li>Clone the repository</li>
            <li>Configure your Auth0 credentials</li>
            <li>Install dependencies: <code>npm install</code></li>
            <li>Start backend: <code>npm run start:dev</code></li>
            <li>Start frontend: <code>cd frontend && npm start</code></li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 2rem;
    }

    .content-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .tech-stack {
      margin: 2rem 0;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 1rem;
    }

    .tech-item {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 6px;
    }

    .tech-item h4 {
      margin-top: 0;
      color: #007bff;
    }

    .tech-item ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .features-section {
      margin: 2rem 0;
    }

    .features-list {
      list-style: none;
      padding: 0;
    }

    .features-list li {
      background: #f8f9fa;
      margin: 0.5rem 0;
      padding: 0.8rem;
      border-radius: 4px;
      border-left: 4px solid #007bff;
    }

    .getting-started {
      margin-top: 2rem;
      background: #e7f3ff;
      padding: 1.5rem;
      border-radius: 6px;
    }

    .getting-started ol {
      margin: 1rem 0 0 0;
    }

    .getting-started li {
      margin: 0.5rem 0;
    }

    code {
      background: #333;
      color: #fff;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    @media (max-width: 768px) {
      .tech-grid {
        grid-template-columns: 1fr;
      }

      .about-container {
        padding: 1rem;
      }
    }
  `]
})
export class AboutComponent {}