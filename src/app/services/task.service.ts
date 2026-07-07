import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task, TaskStatus } from '../models/task.model';
import { API_BASE_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = API_BASE_URL;
  private readonly storageKey = 'cached_tasks';

  public isOffline = signal(false);

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap((tasks) => {
        this.isOffline.set(false);
        this.cacheTasks(tasks);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0 || !navigator.onLine) {
          this.isOffline.set(true);
          const cached = this.getCachedTasks();
          return of(cached);
        }
        return throwError(() => error);
      })
    );
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() => this.isOffline.set(false)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0 || !navigator.onLine) {
          this.isOffline.set(true);
        }
        return throwError(() => error);
      })
    );
  }

  updateTaskStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(() => this.isOffline.set(false)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0 || !navigator.onLine) {
          this.isOffline.set(true);
        }
        return throwError(() => error);
      })
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.isOffline.set(false)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0 || !navigator.onLine) {
          this.isOffline.set(true);
        }
        return throwError(() => error);
      })
    );
  }

  private cacheTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private getCachedTasks(): Task[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
}
