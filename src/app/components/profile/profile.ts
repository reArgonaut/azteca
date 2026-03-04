import { Component, OnInit } from '@angular/core';
import { Action, EcoLevel, Student } from '../../models/models';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';
import { TRANSPORT_LABELS } from '../../data/data';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
})
export class ProfileComponent implements OnInit {
  student!: Student;
  level!: EcoLevel;
  nextLevel: EcoLevel | null = null;
  progress = 0;
  allActions: Action[] = [];
  today = '';

  earned = 0;
  consumed = 0;
  balance = 0;
  transportLabel = '';

  constructor(
    private storage: StorageService,
    private engine: EngineService,
  ) {}

  ngOnInit(): void {
    this.today = this.engine.today();
    const state = this.storage.getState();
    this.student = this.storage.getStudentById(state.currentStudentId!)!;
    this.allActions = this.storage.getActionsByStudent(this.student.id)
      .sort((a, b) => b.date.localeCompare(a.date));

    this.level = this.engine.getEcoLevel(this.student.totalCarbonos);
    this.nextLevel = this.engine.getNextLevel(this.student.totalCarbonos);
    this.progress = this.engine.getProgressToNextLevel(this.student.totalCarbonos);

    const allStorage = this.storage.getActions();
    this.earned = this.engine.calculateDailyEarned(allStorage, this.student.id, this.today);
    this.consumed = this.engine.calculateDailyConsumed(this.student.transportCost);
    this.balance = this.engine.calculateDailyBalance(this.earned, this.consumed);

    this.transportLabel = TRANSPORT_LABELS[this.student.transport];
  }

  get approvedActions(): Action[] {
    return this.allActions.filter(a => a.status === 'approved');
  }

  get pendingActions(): Action[] {
    return this.allActions.filter(a => a.status === 'pending');
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

  typeBadge(type: string): string {
    return type === 'quick' ? 'secondary'
         : type === 'viral' ? 'dark'
         : 'primary';
  }

  typeLabel(type: string): string {
    return type === 'quick' ? 'Rápida' : type === 'viral' ? 'TikTok' : 'Evidencia';
  }
}
