import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="list-container">
      <!-- Search & Filters -->
      <div class="filters-bar">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="search-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.608 10.608Z" />
          </svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search tasks by name or description..."
          />
        </div>
        
        <div class="filter-tabs">
          <button 
            [class.active]="statusFilter === 'ALL'" 
            (click)="setFilter('ALL')"
          >All</button>
          <button 
            [class.active]="statusFilter === 'PENDING'" 
            (click)="setFilter('PENDING')"
          >Pending</button>
          <button 
            [class.active]="statusFilter === 'COMPLETED'" 
            (click)="setFilter('COMPLETED')"
          >Completed</button>
        </div>
      </div>

      <!-- Task Items Table/Grid -->
      <div class="tasks-table-wrapper" *ngIf="filteredTasks.length > 0; else emptyState">
        <table class="tasks-table">
          <thead>
            <tr>
              <th width="80">Status</th>
              <th>Task</th>
              <th class="hide-mobile">Created Date</th>
              <th width="100" class="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let task of filteredTasks; trackBy: trackByTaskId" [class.completed-row]="task.status === 'COMPLETED'">
              <!-- Status Toggle Column -->
              <td>
                <label class="custom-checkbox">
                  <input 
                    type="checkbox" 
                    [checked]="task.status === 'COMPLETED'"
                    (change)="toggleStatus(task)"
                  />
                  <span class="checkmark"></span>
                </label>
              </td>
              
              <!-- Task details column -->
              <td>
                <div class="task-details">
                  <div class="task-name" [title]="task.name">{{ task.name }}</div>
                  <div class="task-desc" *ngIf="task.description" [title]="task.description">{{ task.description }}</div>
                </div>
              </td>
              
              <!-- Created Date Column -->
              <td class="hide-mobile">
                <div class="created-date">
                  {{ task.createdAt | date:'MMM dd, yyyy, hh:mm a' }}
                </div>
              </td>
              
              <!-- Actions (Delete) Column -->
              <td class="actions-col">
                <button class="delete-btn" (click)="deleteTask(task)" title="Delete Task">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="action-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State Template -->
      <ng-template #emptyState>
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="empty-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.375c.9 0 1.625-.724 1.625-1.625V13c0-.9-.725-1.625-1.625-1.625H9.75M12 3c5.25 0 9.75 4.5 9.75 9.75M12 3a9.75 9.75 0 0 0-9.75 9.75M12 3v18m0-18h.008v.008H12V3Zm0 18h.008v.008H12V21Zm0 0c-5.25 0-9.75-4.5-9.75-9.75M12 21a9.75 9.75 0 0 0 9.75-9.75M3.036 12.322a1.012 1.012 0 0 1-.08-.83A9.698 9.698 0 0 1 3 12c0-.528.042-1.045.125-1.548a1.012 1.012 0 0 1 .808-.813c1.282-.244 2.47-.746 3.51-1.468a1.012 1.012 0 0 1 1.258.117l.004.004c.324.324.78.528 1.278.528.5 0 .956-.204 1.28-.528l.002-.002a1.012 1.012 0 0 1 1.258-.117c1.04.722 2.228 1.224 3.51 1.468a1.012 1.012 0 0 1 .808.813c.083.503.125 1.02.125 1.548 0 .108-.002.217-.005.326M3.036 12.322c.11.45.244.887.4 1.306a1.012 1.012 0 0 0 .808.813c1.282.244 2.47.746 3.51 1.468a1.012 1.012 0 0 0 1.258-.117l.004-.004a1.815 1.815 0 0 1 1.278-.528c.5 0 .956.204 1.28.528l.002.002a1.012 1.012 0 0 0 1.258.117c1.04-.722 2.228-1.224 3.51-1.468a1.012 1.012 0 0 0 .808-.813c.156-.419.29-.856.4-1.306" />
          </svg>
          <p>No tasks found. Try adjusting your search or add a new task!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .list-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius-md);
      padding: 1.5rem;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    }
    
    /* Filters Bar */
    .filters-bar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    @media(min-width: 768px) {
      .filters-bar {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
    
    .search-box {
      position: relative;
      flex-grow: 1;
      max-width: 500px;
    }
    
    .search-box input {
      width: 100%;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius-sm);
      padding: 0.65rem 1rem 0.65rem 2.5rem;
      color: var(--text-main);
      font-family: inherit;
      outline: none;
      transition: var(--transition-smooth);
    }
    
    .search-box input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-glow);
      background: rgba(15, 23, 42, 0.8);
    }
    
    .search-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }
    
    .filter-tabs {
      display: flex;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius-sm);
      padding: 3px;
    }
    
    .filter-tabs button {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.5rem 1.25rem;
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 500;
      border-radius: calc(var(--border-radius-sm) - 2px);
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    
    .filter-tabs button:hover:not(.active) {
      color: var(--text-main);
    }
    
    .filter-tabs button.active {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 2px 10px var(--primary-glow);
    }
    
    /* Tasks Table */
    .tasks-table-wrapper {
      overflow-x: auto;
      border-radius: var(--border-radius-sm);
    }
    
    .tasks-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    
    .tasks-table th, .tasks-table td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .tasks-table th {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      font-weight: 600;
      background: rgba(15, 23, 42, 0.2);
    }
    
    .tasks-table tr:hover {
      background: rgba(255, 255, 255, 0.01);
    }
    
    .completed-row {
      opacity: 0.5;
    }
    
    .completed-row .task-name {
      text-decoration: line-through;
      color: var(--text-muted);
    }
    
    /* Custom Checkbox */
    .custom-checkbox {
      display: inline-block;
      position: relative;
      cursor: pointer;
      user-select: none;
      width: 22px;
      height: 22px;
    }
    
    .custom-checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 22px;
      width: 22px;
      background: rgba(15, 23, 42, 0.5);
      border: 2px solid var(--text-muted);
      border-radius: 50%;
      transition: var(--transition-smooth);
    }
    
    .custom-checkbox:hover input ~ .checkmark {
      border-color: var(--primary-color);
    }
    
    .custom-checkbox input:checked ~ .checkmark {
      background-color: var(--success-color);
      border-color: var(--success-color);
      box-shadow: 0 0 10px var(--success-glow);
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    
    .custom-checkbox input:checked ~ .checkmark:after {
      display: block;
    }
    
    .custom-checkbox .checkmark:after {
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    /* Task Details */
    .task-details {
      display: flex;
      flex-direction: column;
      max-width: 320px;
    }
    
    @media(min-width: 600px) {
      .task-details {
        max-width: 450px;
      }
    }
    
    .task-name {
      font-weight: 600;
      color: var(--text-main);
      font-size: 0.95rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .task-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    /* Created Date */
    .created-date {
      font-size: 0.85rem;
      color: var(--text-dark);
    }
    
    /* Actions */
    .actions-header, .actions-col {
      text-align: right;
    }
    
    .delete-btn {
      background: transparent;
      border: none;
      color: var(--text-dark);
      cursor: pointer;
      padding: 0.35rem;
      border-radius: var(--border-radius-sm);
      transition: var(--transition-smooth);
    }
    
    .delete-btn:hover {
      color: var(--danger-color);
      background: var(--danger-glow);
    }
    
    .action-icon {
      width: 18px;
      height: 18px;
    }
    
    /* Mobile Responsive Hiding */
    @media (max-width: 599px) {
      .hide-mobile {
        display: none;
      }
    }
    
    /* Empty State */
    .empty-state {
      padding: 3rem 1.5rem;
      text-align: center;
      color: var(--text-muted);
    }
    
    .empty-icon {
      width: 48px;
      height: 48px;
      color: var(--text-dark);
      margin-bottom: 1rem;
    }
    
    .empty-state p {
      font-size: 0.95rem;
    }
  `]
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() statusToggled = new EventEmitter<{ id: number, status: TaskStatus }>();
  @Output() taskDeleted = new EventEmitter<number>();

  searchQuery = '';
  statusFilter: 'ALL' | 'PENDING' | 'COMPLETED' = 'ALL';

  get filteredTasks(): Task[] {
    return this.tasks.filter(task => {
      const nameMatch = task.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const descMatch = (task.description || '').toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesSearch = nameMatch || descMatch;
      const matchesStatus = this.statusFilter === 'ALL' || task.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  setFilter(filter: 'ALL' | 'PENDING' | 'COMPLETED'): void {
    this.statusFilter = filter;
  }

  toggleStatus(task: Task): void {
    if (task.id !== undefined) {
      const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      this.statusToggled.emit({ id: task.id, status: newStatus });
    }
  }

  deleteTask(task: Task): void {
    if (task.id !== undefined && confirm(`Are you sure you want to delete "${task.name}"?`)) {
      this.taskDeleted.emit(task.id);
    }
  }

  trackByTaskId(index: number, task: Task): number | undefined {
    return task.id;
  }
}
