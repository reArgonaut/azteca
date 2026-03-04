import { Injectable } from '@angular/core';
import {
  BASE_DAILY_CONSUMPTION, ECO_LEVELS,
  MAX_QUICK_ACTIONS_PER_DAY, REJECTION_PENALTY,
  TRANSPORT_RATES
} from '../data/data';
import { Action, EcoLevel, Student, TransportType } from '../models/models';

// ── engine.service.ts — Motor de reglas y cálculo ─────────────────────────

@Injectable({ providedIn: 'root' })
export class EngineService {

  /** Fecha de hoy en formato YYYY-MM-DD */
  today(): string {
    return new Date().toISOString().split('T')[0];
  }

  // ── Cálculos de traslado ───────────────────────────────────────────────────

  calculateTransportCost(transport: TransportType, travelTime: number): number {
    return Math.round(TRANSPORT_RATES[transport] * travelTime);
  }

  // ── Balance diario ────────────────────────────────────────────────────────

  calculateDailyConsumed(transportCost: number): number {
    return BASE_DAILY_CONSUMPTION + transportCost;
  }

  calculateDailyEarned(actions: Action[], studentId: string, today: string): number {
    return actions
      .filter(a => a.studentId === studentId && a.date === today && a.status === 'approved')
      .reduce((sum, a) => sum + a.carbonos, 0);
  }

  calculateDailyBalance(earned: number, consumed: number): number {
    return earned - consumed;
  }

  // ── Control de acciones rápidas ───────────────────────────────────────────

  countTodayQuickActions(actions: Action[], studentId: string, today: string): number {
    return actions.filter(
      a => a.studentId === studentId && a.type === 'quick' && a.date === today
    ).length;
  }

  canDoQuickAction(count: number): boolean {
    return count < MAX_QUICK_ACTIONS_PER_DAY;
  }

  // ── Sistema de niveles ────────────────────────────────────────────────────

  getEcoLevel(totalCarbonos: number): EcoLevel {
    let level = ECO_LEVELS[0];
    for (const l of ECO_LEVELS) {
      if (totalCarbonos >= l.minCarbonos) level = l;
    }
    return level;
  }

  getNextLevel(totalCarbonos: number): EcoLevel | null {
    for (const l of ECO_LEVELS) {
      if (totalCarbonos < l.minCarbonos) return l;
    }
    return null;
  }

  getProgressToNextLevel(totalCarbonos: number): number {
    const current = this.getEcoLevel(totalCarbonos);
    const next = this.getNextLevel(totalCarbonos);
    if (!next) return 100;
    const range = next.minCarbonos - current.minCarbonos;
    const progress = totalCarbonos - current.minCarbonos;
    return Math.min(100, Math.round((progress / range) * 100));
  }

  // ── Aprobación / rechazo de acciones (panel docente) ──────────────────────

  approveAction(
    action: Action, student: Student, bonus: number = 0
  ): { action: Action; student: Student } {
    const finalCarbonos = action.carbonos + bonus;
    const approved: Action = { ...action, status: 'approved', carbonos: finalCarbonos };
    const updated: Student = {
      ...student,
      totalCarbonos: student.totalCarbonos + finalCarbonos
    };
    return { action: approved, student: updated };
  }

  rejectAction(
    action: Action, student: Student
  ): { action: Action; student: Student } {
    const rejected: Action = { ...action, status: 'rejected' };
    const updated: Student = {
      ...student,
      totalCarbonos: Math.max(0, student.totalCarbonos - REJECTION_PENALTY)
    };
    return { action: rejected, student: updated };
  }

  // ── Ranking de grupos ──────────────────────────────────────────────────────

  buildGroupRanking(students: Student[]): {
    group: string; totalCarbonos: number; studentCount: number; position: number
  }[] {
    const map = new Map<string, { totalCarbonos: number; studentCount: number }>();
    for (const s of students) {
      const entry = map.get(s.group) ?? { totalCarbonos: 0, studentCount: 0 };
      entry.totalCarbonos += s.totalCarbonos;
      entry.studentCount++;
      map.set(s.group, entry);
    }
    return Array.from(map.entries())
      .map(([group, data]) => ({ group, ...data, position: 0 }))
      .sort((a, b) => b.totalCarbonos - a.totalCarbonos)
      .map((g, i) => ({ ...g, position: i + 1 }));
  }
}
