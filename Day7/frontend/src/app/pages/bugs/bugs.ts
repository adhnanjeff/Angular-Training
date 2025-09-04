import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';        // ✅ use Select (not Dropdown)
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BugService } from '../../services/bug.service';
import { DialogModule } from 'primeng/dialog';

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
    SelectModule,             // ✅ here
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule
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

  statuses = [
    { label: 'All Status', value: '' },
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' }
  ];

  priorities = [
    { label: 'All Priority', value: '' },
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' }
  ];
  bugIdCounter = 1;
  selectedStatus: string = '';
  selectedPriority: string = '';
  clonedBugs: { [s: string]: Bug } = {};

  bugDialog: boolean = false;
  bugForm!: FormGroup;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private bugService: BugService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadBugsFromAPI();
  }

  newBugTitle: string = '';
  openNewBugDialog() {
    this.bugForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],        // ✅ added title
      description: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      createdDate: [new Date().getDate]                // ✅ proper Date object
    });
    this.bugDialog = true;
  }


  postBug() {
  if (this.bugForm.valid) {
    const newBug: Bug = {
      ...this.bugForm.value,
      id: this.bugIdCounter++,
      createdDate: new Date().getDate   // ✅ ensure it's a Date
    };

    this.bugService.postBugs(newBug).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Bug added successfully' });
        this.loadBugsFromAPI();
        this.bugDialog = false;
        this.bugForm.reset();
      },
      error: (err) => {
        console.error('Error posting bug:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add bug' });
      }
    });
  }
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

    if (this.selectedStatus) {
      filtered = filtered.filter(bug => bug.status === this.selectedStatus);
    }

    if (this.selectedPriority) {
      filtered = filtered.filter(bug => bug.priority === this.selectedPriority);
    }

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
    this.clonedBugs[bug.id] = { ...bug }; // save original data
    console.log('Edit init for bug:', bug);
  }

  // called when row is saved
  onRowEditSave(bug: Bug) {
    if (bug.title.trim().length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation',
        detail: 'Title is required'
      });
      return;
    }

    this.bugService.updateCurrentBugs(bug.id, bug).subscribe({
  next: (updatedBug) => {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `Bug "${bug.title}" updated successfully`
    });
    console.log('Updated bug:', updatedBug);
  },
  error: (err) => {
    console.error('Error updating bug:', err);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update bug'
    });
  }
});

  }

  // called when row edit is cancelled
  onRowEditCancel(bug: Bug, index: number) {
    this.bugs[index] = this.clonedBugs[bug.id]; // restore old values
    delete this.clonedBugs[bug.id];
    console.log('Edit cancelled for bug:', bug);
  }

  deleteBug(bug: Bug) {
  this.confirmationService.confirm({
    message: `Are you sure you want to delete bug "${bug.title}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      console.log('Deleting bug with ID:', bug.id);
      this.bugService.deleteBugs(bug.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Bug deleted successfully'
          });
          this.loadBugsFromAPI();
        },
        error: (err: any) => {
          console.error('Error deleting bug:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete bug'
          });
        }
      });
    }
  });
}

  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Open': return 'info';
      case 'In Progress': return 'warning';
      case 'Resolved': return 'success';
      case 'Closed': return 'secondary';
      default: return 'info';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warning' | 'danger' {
    switch (priority) {
      case 'Low': return 'success';
      case 'Medium': return 'info';
      case 'High': return 'warning';
      case 'Critical': return 'danger';
      default: return 'info';
    }
  }
}
