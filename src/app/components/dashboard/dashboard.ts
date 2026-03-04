import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EVIDENCE_ACTIONS, MAX_QUICK_ACTIONS_PER_DAY, QUICK_ACTIONS } from '../../data/data';
import { Action, Student } from '../../models/models';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  student!: Student;
  allActions: Action[] = [];
  todayActions: Action[] = [];

  quickActions = QUICK_ACTIONS;
  evidenceActions = EVIDENCE_ACTIONS;

  // Evidence form
  selectedEvidence = '';
  evidenceText = '';
  evidenceSuccess = '';
  evidenceError = '';

  today = '';
  quickCount = 0;
  maxQuick = MAX_QUICK_ACTIONS_PER_DAY;
  quickLimitReached = false;
  earned = 0;
  consumed = 0;
  balance = 0;

  constructor(
    private storage: StorageService,
    private engine: EngineService,
  ) {}

  ngOnInit(): void {
    this.today = this.engine.today();
    this.load();
  }

  load(): void {
    const state = this.storage.getState();
    this.student = this.storage.getStudentById(state.currentStudentId!)!;
    this.allActions = this.storage.getActions();
    this.todayActions = this.allActions.filter(
      a => a.studentId === this.student.id && a.date === this.today
    );

    this.quickCount = this.engine.countTodayQuickActions(
      this.allActions, this.student.id, this.today
    );
    this.quickLimitReached = !this.engine.canDoQuickAction(this.quickCount);
    this.earned = this.engine.calculateDailyEarned(
      this.allActions, this.student.id, this.today
    );
    this.consumed = this.engine.calculateDailyConsumed(this.student.transportCost);
    this.balance = this.engine.calculateDailyBalance(this.earned, this.consumed);
  }

  canDoQuick(actionId: string): boolean {
    if (!this.engine.canDoQuickAction(this.quickCount)) return false;
    // Already done today?
    return !this.todayActions.some(
      a => a.actionId === actionId && a.type === 'quick'
    );
  }

  doQuickAction(qa: { id: string; title: string; carbonos: number }): void {
    if (!this.canDoQuick(qa.id)) return;

    const action: Action = {
      id: crypto.randomUUID(),
      studentId: this.student.id,
      studentNickname: this.student.nickname,
      studentGroup: this.student.group,
      type: 'quick',
      actionId: qa.id,
      title: qa.title,
      carbonos: qa.carbonos,
      status: 'approved',
      date: this.today,
    };

    // Quick actions are immediately approved → update totalCarbonos
    const updatedStudent: Student = {
      ...this.student,
      totalCarbonos: this.student.totalCarbonos + qa.carbonos,
    };

    this.storage.saveAction(action);
    this.storage.saveStudent(updatedStudent);
    this.load();
  }

  submitEvidence(): void {
    this.evidenceError = '';
    this.evidenceSuccess = '';

    if (!this.selectedEvidence) {
      this.evidenceError = 'Selecciona una acción.';
      return;
    }
    if (!this.evidenceText.trim()) {
      this.evidenceError = 'Describe la evidencia.';
      return;
    }

    const def = EVIDENCE_ACTIONS.find(e => e.id === this.selectedEvidence)!;
    const action: Action = {
      id: crypto.randomUUID(),
      studentId: this.student.id,
      studentNickname: this.student.nickname,
      studentGroup: this.student.group,
      type: 'evidence',
      actionId: def.id,
      title: def.title,
      carbonos: def.carbonos,
      status: 'pending',
      date: this.today,
      evidence: this.evidenceText.trim(),
    };

    this.storage.saveAction(action);
    this.selectedEvidence = '';
    this.evidenceText = '';
    this.evidenceSuccess = '✅ Enviado. Esperando validación del docente.';
    this.load();
  }

  get levelInfo() {
    return this.engine.getEcoLevel(this.student.totalCarbonos);
  }

  statusBadge(status: string): string {
    return status === 'approved' ? 'success'
         : status === 'pending'  ? 'warning'
         : 'danger';
  }

  statusLabel(status: string): string {
    return status === 'approved' ? '✅ Aprobado'
         : status === 'pending'  ? '⏳ Pendiente'
         : '❌ Rechazado';
  }
}
