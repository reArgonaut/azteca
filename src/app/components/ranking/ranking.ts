import { Component, OnInit } from '@angular/core';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';

interface GroupEntry {
  group: string;
  totalCarbonos: number;
  studentCount: number;
  position: number;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [],
  templateUrl: './ranking.html',
})
export class RankingComponent implements OnInit {
  ranking: GroupEntry[] = [];
  currentGroup = '';

  constructor(
    private storage: StorageService,
    private engine: EngineService,
  ) {}

  ngOnInit(): void {
    const students = this.storage.getStudents();
    this.ranking = this.engine.buildGroupRanking(students);

    const state = this.storage.getState();
    if (state.currentStudentId) {
      const student = this.storage.getStudentById(state.currentStudentId);
      this.currentGroup = student?.group ?? '';
    }
  }

  medal(position: number): string {
    return position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : `${position}º`;
  }

  rowClass(position: number, group: string): string {
    const isCurrent = group === this.currentGroup ? 'table-success' : '';
    return position === 1 ? `table-warning ${isCurrent}` : isCurrent;
  }
}
