import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { REJECTION_PENALTY, TEACHER_PASSWORD } from '../../data/data';
import { Action, Student } from '../../models/models';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './teacher.html',
})
export class TeacherComponent implements OnInit {
  authenticated = false;
  password = '';
  passwordError = '';

  pendingActions: Action[] = [];
  rejectionPenalty = REJECTION_PENALTY;
  bonusMap: Record<string, number> = {};
  feedbackMsg = '';

  constructor(
    private storage: StorageService,
    private engine: EngineService,
  ) {}

  ngOnInit(): void {
    const state = this.storage.getState();
    this.authenticated = state.isTeacher;
    if (this.authenticated) this.loadPending();
  }

  login(): void {
    if (this.password === TEACHER_PASSWORD) {
      this.authenticated = true;
      this.storage.setState({ isTeacher: true });
      this.loadPending();
    } else {
      this.passwordError = 'Contraseña incorrecta.';
    }
  }

  logout(): void {
    this.authenticated = false;
    this.storage.setState({ isTeacher: false });
    this.password = '';
    this.passwordError = '';
  }

  loadPending(): void {
    this.pendingActions = this.storage.getPendingActions();
    this.feedbackMsg = '';
  }

  approve(action: Action): void {
    const student = this.storage.getStudentById(action.studentId);
    if (!student) return;

    const bonus = this.bonusMap[action.id] ?? 0;
    const { action: updated, student: updatedStudent } =
      this.engine.approveAction(action, student, bonus);

    this.storage.saveAction(updated);
    this.storage.saveStudent(updatedStudent);
    this.feedbackMsg = `✅ Aprobado: "${action.title}" para ${action.studentNickname} (+${updated.carbonos} C)`;
    this.loadPending();
  }

  reject(action: Action): void {
    const student = this.storage.getStudentById(action.studentId);
    if (!student) return;

    const { action: updated, student: updatedStudent } =
      this.engine.rejectAction(action, student);

    this.storage.saveAction(updated);
    this.storage.saveStudent(updatedStudent);
    this.feedbackMsg = `❌ Rechazado: "${action.title}" (−${this.rejectionPenalty} C aplicado en privado)`;
    this.loadPending();
  }

  typeBadge(type: string): string {
    return type === 'viral' ? 'dark' : 'primary';
  }

  typeLabel(type: string): string {
    return type === 'viral' ? '🎵 TikTok' : '📋 Evidencia';
  }

  allStudents(): Student[] {
    return this.storage.getStudents();
  }
}
