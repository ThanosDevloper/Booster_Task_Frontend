import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';
import { describe, beforeEach, it, expect, afterEach } from 'vitest';

describe('TaskService', () => {
  let service: TaskService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TaskService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks and cache them', () => {
    const mockTasks: Task[] = [
      { id: 1, name: 'Task 1', description: 'Desc 1', status: 'PENDING' }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
      expect(service.isOffline()).toBe(false);
      
      const cached = localStorage.getItem('cached_tasks');
      expect(cached).toBeTruthy();
      expect(JSON.parse(cached!)).toEqual(mockTasks);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should fall back to cache when network is offline', () => {
    const mockTasks: Task[] = [
      { id: 1, name: 'Cached Task', description: 'Desc', status: 'PENDING' }
    ];
    localStorage.setItem('cached_tasks', JSON.stringify(mockTasks));

    service.getTasks().subscribe({
      next: (tasks) => {
        expect(tasks).toEqual(mockTasks);
        expect(service.isOffline()).toBe(true);
      }
    });

    const req = httpTestingController.expectOne('http://localhost:8080/api/tasks');
    req.error(new ProgressEvent('Network error'), { status: 0 });
  });
});
