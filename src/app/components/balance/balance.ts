import { Component, OnInit } from '@angular/core';
import { BASE_DAILY_CONSUMPTION } from '../../data/data';
import { Action, Student } from '../../models/models';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [],
  templateUrl: './balance.html',
})
export class BalanceComponent implements OnInit {
  student!: Student;
  earned = 0;
  consumed = 0;
  balance = 0;
  baseConsumption = BASE_DAILY_CONSUMPTION;
  today = '';
  todayActions: Action[] = [];

  constructor(
    private storage: StorageService,
    private engine: EngineService,
  ) {}

  ngOnInit(): void {
    this.today = this.engine.today();
    const state = this.storage.getState();
    this.student = this.storage.getStudentById(state.currentStudentId!)!;
    const allActions = this.storage.getActions();

    this.todayActions = allActions.filter(
      a => a.studentId === this.student.id && a.date === this.today && a.status === 'approved'
    );

    this.earned = this.engine.calculateDailyEarned(allActions, this.student.id, this.today);
    this.consumed = this.engine.calculateDailyConsumed(this.student.transportCost);
    this.balance = this.engine.calculateDailyBalance(this.earned, this.consumed);
  }

  get isNegative(): boolean { return this.balance < 0; }
  get isPositive(): boolean { return this.balance > 0; }
}
