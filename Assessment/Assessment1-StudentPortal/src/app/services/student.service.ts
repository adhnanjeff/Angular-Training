import { Injectable, signal } from '@angular/core';
import { Student } from '../models/student';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly studentsSignal = signal<Student[]>([]);
  private nextId = 1;

  get students() {
    return this.studentsSignal.asReadonly();
  }

  add(student: Omit<Student, 'id'>): void {
    const newStudent: Student = { id: this.nextId++, ...student };
    this.studentsSignal.update(list => [...list, newStudent]);
  }

  update(updated: Student): void {
    this.studentsSignal.update(list => list.map(s => (s.id === updated.id ? updated : s)));
  }
}


