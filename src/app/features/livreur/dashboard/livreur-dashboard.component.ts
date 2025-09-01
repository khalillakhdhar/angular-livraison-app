import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-livreur-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de bord Livreur</h1>
      <p>Dashboard livreur en construction...</p>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      background: linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e);
      min-height: 100vh;
      color: white;
    }
    h1 {
      font-family: 'Orbitron', monospace;
      color: #00ffff;
    }
  `]
})
export class LivreurDashboardComponent {}