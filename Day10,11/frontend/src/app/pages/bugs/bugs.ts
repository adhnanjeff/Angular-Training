import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BugService, Bug as ServiceBug, Comment } from '../../services/bug.service';
import { AuthService } from '../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { BugDetailComponent } from '../../bug-detail.component';

export interface Bug {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdDate: Date;
  selected?: boolean;
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
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    BugDetailComponent,
    ConfirmDialogModule
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
  selectedBugs: Bug[] = [];

  bugDialog: boolean = false;
  bugForm!: FormGroup;
  showBugDetailDialog: boolean = false;
  selectedBugForDetail?: ServiceBug;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private bugService: BugService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  get userRole(): string | null {
    return this.authService.getUserRole();
  }

  get isDeveloper(): boolean {
    return this.userRole === 'Developer';
  }

  get isTester(): boolean {
    return this.userRole === 'Tester';
  }

  canAdd(): boolean {
    const role = this.userRole;
    return role === 'Admin' || role === 'Developer' || role === 'Tester';
  }

  canEdit(): boolean {
    const role = this.userRole;
    return role === 'Admin' || role === 'Tester';
  }

  canDelete(): boolean {
    return this.userRole === 'Admin';
  }

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
      }
    });
  }
}



  loadBugsFromAPI() {
    this.bugService.getBugs().subscribe({
      next: (data) => {
        this.bugs = data.map(bug => ({ ...bug, selected: false }));
        this.selectedBugs = [];
        this.applyAllFilters();
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

  onBugClick(bug: Bug) {
    this.bugService.getBug(bug.id).subscribe({
      next: (fullBug) => {
        this.selectedBugForDetail = fullBug;
        this.showBugDetailDialog = true;
      }
    });
  }

  closeBugDetailDialog() {
    this.showBugDetailDialog = false;
    this.selectedBugForDetail = undefined;
  }

  onBugSelect(bug: Bug) {
    if (bug.selected) {
      this.selectedBugs.push(bug);
    } else {
      this.selectedBugs = this.selectedBugs.filter(b => b.id !== bug.id);
    }
  }

  getColspan(): number {
    let cols = 5; // base columns: ID, Title, Description, Status, Priority
    if (!this.isDeveloper && !this.isTester) cols++; // Created Date
    if (!this.isDeveloper) cols++; // Actions
    if (this.canDelete()) cols++; // Select checkbox
    return cols;
  }

  deleteSelectedBugs() {
    if (this.selectedBugs.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No bugs selected for deletion'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${this.selectedBugs.length} selected bug(s)?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedBugs.map(bug => bug.id);
        this.bugService.deleteMultipleBugs(ids).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `${this.selectedBugs.length} bug(s) deleted successfully`
            });
            this.selectedBugs = [];
            this.loadBugsFromAPI();
          }
        });
      }
    });
  }
}
