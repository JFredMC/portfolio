import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { IProject } from './interfaces/project.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  imports: [CommonModule],
})
export class Projects implements OnInit {
  private readonly http = inject(HttpClient);

  readonly statusLabels: Record<IProject['status'], string> = {
    completed: 'Completado',
    'in-progress': 'En progreso',
    planned: 'Planeado',
  };

  projects: IProject[] = [];

  ngOnInit(): void {
    this.http.get<IProject[]>('assets/data/projects.json').subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: () => {
        this.projects = [];
      },
    });
  }
}
