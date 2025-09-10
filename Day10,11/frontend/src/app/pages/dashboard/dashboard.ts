import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BugService, Bug } from '../../services/bug.service';
import { AdminDashboardComponent } from '../../admin-dashboard.component';

interface BugAnalytics {
  totalActiveBugs: number;
  bugsClosedThisMonth: number;
  importantBugsCount: number;
  totalBugs: number;
  highPriorityBugs: number;
  mediumPriorityBugs: number;
  lowPriorityBugs: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, AdminDashboardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  bugAnalytics: BugAnalytics = {
    totalActiveBugs: 0,
    bugsClosedThisMonth: 0,
    importantBugsCount: 0,
    totalBugs: 0,
    highPriorityBugs: 0,
    mediumPriorityBugs: 0,
    lowPriorityBugs: 0
  };

  constructor(
    private authService: AuthService,
    private bugService: BugService
  ) {}

  ngOnInit() {
    this.loadBugAnalytics();
  }

  get userRole(): string | null {
    return this.authService.getUserRole();
  }

  get canAccessBugs(): boolean {
    const role = this.authService.getUserRole();
    return role === 'Admin' || role === 'Developer' || role === 'Tester';
  }

  private loadBugAnalytics() {
    this.bugService.getBugs().subscribe({
      next: (bugs: Bug[]) => {
        this.calculateAnalytics(bugs);
      },
      error: (error) => {
        console.error('Error loading bug analytics:', error);
      }
    });
  }

  private calculateAnalytics(bugs: Bug[]) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    this.bugAnalytics.totalBugs = bugs.length;
    this.bugAnalytics.totalActiveBugs = bugs.filter(bug => bug.status !== 'Closed').length;
    this.bugAnalytics.bugsClosedThisMonth = bugs.filter(bug => {
      const bugDate = new Date(bug.createdDate);
      return bug.status === 'Closed' && 
             bugDate.getMonth() === currentMonth && 
             bugDate.getFullYear() === currentYear;
    }).length;
    
    this.bugAnalytics.importantBugsCount = bugs.filter(bug => 
      bug.priority === 'High' && bug.status !== 'Closed'
    ).length;
    
    this.bugAnalytics.highPriorityBugs = bugs.filter(bug => bug.priority === 'High').length;
    this.bugAnalytics.mediumPriorityBugs = bugs.filter(bug => bug.priority === 'Medium').length;
    this.bugAnalytics.lowPriorityBugs = bugs.filter(bug => bug.priority === 'Low').length;
  }
}
