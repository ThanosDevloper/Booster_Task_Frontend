import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { Task, TaskStatus } from './models/task.model';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TaskFormComponent } from './components/task-form/task-form';
import { TaskListComponent } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardComponent, 
    TaskFormComponent, 
    TaskListComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private taskService = inject(TaskService);
  
  public tasks = signal<Task[]>([]);
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);
  
  // Expose isOffline signal from TaskService
  public isOffline = this.taskService.isOffline;

  constructor() {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.errorMessage.set('Failed to load tasks from server.');
        this.isLoading.set(false);
      }
    });
  }

  onTaskCreated(taskData: Omit<Task, 'id' | 'status' | 'createdAt'>): void {
    const newTask: Task = {
      name: taskData.name,
      description: taskData.description,
      status: 'PENDING'
    };

    this.isLoading.set(true);
    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        // Optimistically update list or push the returned task from server
        this.tasks.update((prev) => [...prev, createdTask]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to create task', err);
        this.errorMessage.set('Failed to create task. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  onStatusToggled(event: { id: number; status: TaskStatus }): void {
    this.taskService.updateTaskStatus(event.id, event.status).subscribe({
      next: (updatedTask) => {
        // Update the task status in-place
        this.tasks.update((prev) => 
          prev.map((t) => t.id === event.id ? { ...t, status: updatedTask.status } : t)
        );
      },
      error: (err) => {
        console.error('Failed to update task status', err);
        this.errorMessage.set('Failed to update task status.');
      }
    });
  }

  onTaskDeleted(id: number): void {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        // Remove task from local list
        this.tasks.update((prev) => prev.filter((t) => t.id !== id));
      },
      error: (err) => {
        console.error('Failed to delete task', err);
        this.errorMessage.set('Failed to delete task.');
      }
    });
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}
