import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-grid">
      <div class="stat-card total">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375c.9 0 1.625-.724 1.625-1.625V13c0-.9-.725-1.625-1.625-1.625H9.75M12 3c5.25 0 9.75 4.5 9.75 9.75M12 3a9.75 9.75 0 0 0-9.75 9.75M12 3v18m0-18h.008v.008H12V3Zm0 18h.008v.008H12V21Zm0 0c-5.25 0-9.75-4.5-9.75-9.75M12 21a9.75 9.75 0 0 0 9.75-9.75M3.036 12.322a1.012 1.012 0 0 1-.08-.83A9.698 9.698 0 0 1 3 12c0-.528.042-1.045.125-1.548a1.012 1.012 0 0 1 .808-.813c1.282-.244 2.47-.746 3.51-1.468a1.012 1.012 0 0 1 1.258.117l.004.004c.324.324.78.528 1.278.528.5 0 .956-.204 1.28-.528l.002-.002a1.012 1.012 0 0 1 1.258-.117c1.04.722 2.228 1.224 3.51 1.468a1.012 1.012 0 0 1 .808.813c.083.503.125 1.02.125 1.548 0 .108-.002.217-.005.326M3.036 12.322c.11.45.244.887.4 1.306a1.012 1.012 0 0 0 .808.813c1.282.244 2.47.746 3.51 1.468a1.012 1.012 0 0 0 1.258-.117l.004-.004a1.815 1.815 0 0 1 1.278-.528c.5 0 .956.204 1.28.528l.002.002a1.012 1.012 0 0 0 1.258.117c1.04-.722 2.228-1.224 3.51-1.468a1.012 1.012 0 0 0 .808-.813c.156-.419.29-.856.4-1.306" />
          </svg>
        </div>
        <div class="stat-info">
          <h3>Total Tasks</h3>
          <p class="stat-number">{{ totalTasks }}</p>
        </div>
      </div>
      <div class="stat-card pending">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div class="stat-info">
          <h3>Pending</h3>
          <p class="stat-number">{{ pendingTasks }}</p>
        </div>
      </div>
      <div class="stat-card completed">
        <div class="icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div class="stat-info">
          <h3>Completed</h3>
          <p class="stat-number">{{ completedTasks }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius-md);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      transition: var(--transition-smooth);
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 12px 30px -4px rgba(0, 0, 0, 0.5);
    }
    .stat-card.total::before { background: var(--primary-color); }
    .stat-card.total:hover { box-shadow: 0 8px 24px -4px var(--primary-glow); }
    .stat-card.pending::before { background: var(--pending-color); }
    .stat-card.pending:hover { box-shadow: 0 8px 24px -4px var(--pending-glow); }
    .stat-card.completed::before { background: var(--success-color); }
    .stat-card.completed:hover { box-shadow: 0 8px 24px -4px var(--success-glow); }
    
    .icon-container {
      width: 50px;
      height: 50px;
      border-radius: var(--border-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
    }
    .stat-card.total .icon-container { color: var(--primary-color); background: var(--primary-glow); }
    .stat-card.pending .icon-container { color: var(--pending-color); background: var(--pending-glow); }
    .stat-card.completed .icon-container { color: var(--success-color); background: var(--success-glow); }
    
    .icon {
      width: 24px;
      height: 24px;
    }
    .stat-info h3 {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.2;
    }
  `]
})
export class DashboardComponent {
  @Input() tasks: Task[] = [];

  get totalTasks(): number {
    return this.tasks.length;
  }

  get pendingTasks(): number {
    return this.tasks.filter(t => t.status === 'PENDING').length;
  }

  get completedTasks(): number {
    return this.tasks.filter(t => t.status === 'COMPLETED').length;
  }
}
