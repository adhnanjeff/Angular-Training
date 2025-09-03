import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { BugService } from '../../services/bug.service';

export interface Bug {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdDate: Date;
}


@Component({
  selector: 'app-bugs',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    InputTextModule,
    Select,
    ConfirmDialogModule,
    ToastModule,
    FormsModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './bugs.html',
  styleUrls: ['./bugs.css']
})
export class BugsComponent implements OnInit {
  bugs: Bug[] = [];
  filteredBugs: Bug[] = [];
  displayedBugs: Bug[] = [];
  globalSearchValue: string = '';
  statuses = [{ label: 'All Status', value: '' }, { label: 'Open', value: 'Open' }, { label: 'In Progress', value: 'In Progress' }, { label: 'Resolved', value: 'Resolved' }, { label: 'Closed', value: 'Closed' }];
  priorities = [{ label: 'All Priority', value: '' }, { label: 'Low', value: 'Low' }, { label: 'Medium', value: 'Medium' }, { label: 'High', value: 'High' }, { label: 'Critical', value: 'Critical' }];
  selectedStatus: string = '';
  selectedPriority: string = '';
  clonedBugs: { [s: string]: Bug } = {};

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private bugService: BugService
  ) {}

  ngOnInit() {
    this.loadBugsFromAPI();
  }

  loadBugsFromAPI() {
    this.bugService.getBugs().subscribe({
      next: (data) => {
        this.bugs = data;
        this.applyAllFilters();
      },
      error: (error) => {
        console.error('Error loading bugs:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load bugs' });
      }
    });
  }

  applyAllFilters() {
    let filtered = this.bugs;

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(bug => bug.status === this.selectedStatus);
    }

    // Apply priority filter
    if (this.selectedPriority) {
      filtered = filtered.filter(bug => bug.priority === this.selectedPriority);
    }

    // Apply global search
    if (this.globalSearchValue.trim()) {
      const searchTerm = this.globalSearchValue.toLowerCase().trim();
      filtered = filtered.filter(bug => 
        bug.title.toLowerCase().includes(searchTerm) ||
        bug.description.toLowerCase().includes(searchTerm)
      );
    }

    this.displayedBugs = filtered;
  }

  onGlobalSearch() {
    this.applyAllFilters();
  }

  onStatusChange() {
    this.applyAllFilters();
  }

  onPriorityChange() {
    this.applyAllFilters();
  }

  clearFilters() {
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.globalSearchValue = '';
    this.applyAllFilters();
  }

  onRowEditInit(bug: Bug) {
    this.clonedBugs[bug.id.toString()] = { ...bug };
  }

  onRowEditSave(bug: Bug) {
    delete this.clonedBugs[bug.id.toString()];
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bug updated successfully' });
  }

  onRowEditCancel(bug: Bug, index: number) {
    this.bugs[index] = this.clonedBugs[bug.id.toString()];
    delete this.clonedBugs[bug.id.toString()];
  }

  deleteBug(bug: Bug) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete bug "${bug.title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.bugs = this.bugs.filter(b => b.id !== bug.id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bug deleted successfully' });
      }
    });
  }

  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Open': return 'info';        // blue
      case 'In Progress': return 'warning';  // orange
      case 'Resolved': return 'success';     // green
      case 'Closed': return 'secondary';     // gray
      default: return 'info';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (priority) {
      case 'Low': return 'success';      // green
      case 'Medium': return 'info';      // blue
      case 'High': return 'warning';     // orange
      case 'Critical': return 'danger';  // red
      default: return 'info';
    }
  }
}
