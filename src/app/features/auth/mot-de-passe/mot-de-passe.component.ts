import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mot-de-passe',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Récupération de mot de passe</h1>
        <p>Page de récupération en construction...</p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e);
    }
    .auth-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      color: white;
    }
    h1 {
      font-family: 'Orbitron', monospace;
      color: #00ffff;
    }
  `]
})
export class MotDePasseComponent {}