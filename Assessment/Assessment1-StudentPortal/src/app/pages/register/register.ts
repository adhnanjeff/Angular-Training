import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  departments = ['Computer Science','Mathematics','Physics','Chemistry'];

  form!: FormGroup;

  constructor(private fb: FormBuilder, private studentService: StudentService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null as number | null, [Validators.required, Validators.min(16), Validators.max(45)]],
      department: ['', [Validators.required]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, email, age, department } = this.form.value;
    this.studentService.add({ name: name!, email: email!, age: age!, department: department! });
    this.form.reset();
  }
}
