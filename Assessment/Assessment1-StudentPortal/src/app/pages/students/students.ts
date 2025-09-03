import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './students.html',
  styleUrl: './students.css'
})
export class StudentsComponent {
  departmentsOptions = [
    { label: 'Computer Science', value: 'Computer Science' },
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Physics', value: 'Physics' },
    { label: 'Chemistry', value: 'Chemistry' }
  ];
  students = computed(() => this.studentService.students());

  displayDialog = signal(false);
  editing!: Student | null;
  editForm!: FormGroup;

  constructor(private studentService: StudentService, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null as number | null, [Validators.required, Validators.min(16), Validators.max(45)]],
      department: ['', [Validators.required]]
    });
  }

  onRowSelect(event: any): void {
    const student: Student | undefined = event?.data as Student | undefined;
    if (!student) return;
    this.editing = student;
    this.editForm.reset({ ...student });
    this.displayDialog.set(true);
  }

  save(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.studentService.update(this.editForm.value as Student);
    this.displayDialog.set(false);
  }

  cancel(): void {
    this.displayDialog.set(false);
  }
}
