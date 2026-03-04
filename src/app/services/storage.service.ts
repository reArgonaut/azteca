import { Injectable } from '@angular/core';
import { Action, AppState, Student } from '../models/models';

// ── storage.service.ts — Persistencia local (localStorage) ────────────────

const KEYS = {
  STUDENTS: 'azteca_students',
  ACTIONS:  'azteca_actions',
  STATE:    'azteca_state',
  SEEDED:   'azteca_seeded',
};

@Injectable({ providedIn: 'root' })
export class StorageService {

  // ── Estudiantes ───────────────────────────────────────────────────────────

  getStudents(): Student[] {
    return JSON.parse(localStorage.getItem(KEYS.STUDENTS) ?? '[]');
  }

  saveStudent(student: Student): void {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.id === student.id);
    if (idx >= 0) students[idx] = student;
    else students.push(student);
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(students));
  }

  getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  // ── Acciones ──────────────────────────────────────────────────────────────

  getActions(): Action[] {
    return JSON.parse(localStorage.getItem(KEYS.ACTIONS) ?? '[]');
  }

  saveAction(action: Action): void {
    const actions = this.getActions();
    const idx = actions.findIndex(a => a.id === action.id);
    if (idx >= 0) actions[idx] = action;
    else actions.push(action);
    localStorage.setItem(KEYS.ACTIONS, JSON.stringify(actions));
  }

  getActionsByStudent(studentId: string): Action[] {
    return this.getActions().filter(a => a.studentId === studentId);
  }

  /** Acciones pendientes de validación docente (sólo evidence y viral) */
  getPendingActions(): Action[] {
    return this.getActions().filter(
      a => a.status === 'pending' && a.type !== 'quick'
    );
  }

  // ── Estado de la app ──────────────────────────────────────────────────────

  getState(): AppState {
    const defaults: AppState = { currentStudentId: null, isTeacher: false };
    return JSON.parse(localStorage.getItem(KEYS.STATE) ?? JSON.stringify(defaults));
  }

  setState(state: Partial<AppState>): void {
    localStorage.setItem(KEYS.STATE, JSON.stringify({ ...this.getState(), ...state }));
  }

  clearState(): void {
    localStorage.setItem(KEYS.STATE, JSON.stringify({ currentStudentId: null, isTeacher: false }));
  }

  // ── Control de seeding para demo ──────────────────────────────────────────

  isSeeded(): boolean {
    return localStorage.getItem(KEYS.SEEDED) === 'true';
  }

  markSeeded(): void {
    localStorage.setItem(KEYS.SEEDED, 'true');
  }

  resetAll(): void {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
}
