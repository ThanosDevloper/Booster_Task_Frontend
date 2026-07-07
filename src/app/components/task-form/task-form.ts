import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2 class="form-title">Create New Task</h2>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Task Name <span class="required">*</span></label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            placeholder="What needs to be done?" 
            [class.invalid]="isFieldInvalid('name')"
          />
          <div *ngIf="isFieldInvalid('name')" class="error-message">
            Task name is required.
          </div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            formControlName="description" 
            placeholder="Add some details about this task..."
            rows="3"
          ></textarea>
        </div>

        <button type="submit" [disabled]="taskForm.invalid" class="submit-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="btn-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Task
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius-md);
      padding: 2rem;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
    }
    @media (max-width: 599px) {
      .form-container {
        padding: 1.25rem;
      }
    }
    .form-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--text-main);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 0.75rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .required {
      color: var(--danger-color);
    }
    input[type="text"], textarea {
      width: 100%;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid var(--card-border);
      border-radius: var(--border-radius-sm);
      padding: 0.75rem 1rem;
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: var(--transition-smooth);
    }
    input[type="text"]:focus, textarea:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-glow);
      background: rgba(15, 23, 42, 0.8);
    }
    input.invalid {
      border-color: var(--danger-color) !important;
    }
    input.invalid:focus {
      box-shadow: 0 0 0 3px var(--danger-glow) !important;
    }
    .error-message {
      color: var(--danger-color);
      font-size: 0.8rem;
      margin-top: 0.35rem;
      animation: fadeIn 0.2s ease-out;
    }
    .submit-btn {
      width: 100%;
      background: var(--primary-color);
      border: none;
      border-radius: var(--border-radius-sm);
      color: white;
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: var(--transition-smooth);
    }
    .submit-btn:hover:not(:disabled) {
      background: var(--primary-hover);
      box-shadow: 0 4px 15px var(--primary-glow);
      transform: translateY(-1px);
    }
    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-icon {
      width: 18px;
      height: 18px;
    }
  `]
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<Omit<Task, 'id' | 'status' | 'createdAt'>>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('.*\\S.*')]],
      description: ['']
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      this.taskCreated.emit({
        name: formValue.name.trim(),
        description: formValue.description.trim()
      });
      this.taskForm.reset();
    }
  }
}
