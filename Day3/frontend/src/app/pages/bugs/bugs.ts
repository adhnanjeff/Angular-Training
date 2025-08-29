import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bug, BugService } from '../../services/bug.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-bugs',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    CardModule,
    TooltipModule
  ],
  templateUrl: './bugs.html',
  styleUrl: './bugs.css'
})

export class BugsComponent implements OnInit {
  bugs: Bug[] = [];
  loading = true;
  error: string | null = null;

  constructor(private bugService: BugService) {}

  ngOnInit(): void {
    this.bugService.getBugs().subscribe({
      next: (data) => {
        this.bugs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error fetching bugs';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'open':
        return 'danger';
      case 'in_progress':
        return 'warning';
      case 'closed':
        return 'success';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: string): string {
    return status.replace('_', ' ').toUpperCase();
  }
}