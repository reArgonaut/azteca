import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';
import { Student } from '../../models/models';
import { EcoLevel } from '../../models/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  student: Student | null = null;
  level: EcoLevel | null = null;
  isTeacher = false;

  constructor(
    private storage: StorageService,
    private engine: EngineService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const state = this.storage.getState();
    this.isTeacher = state.isTeacher;
    if (state.currentStudentId) {
      this.student = this.storage.getStudentById(state.currentStudentId) ?? null;
      if (this.student) {
        this.level = this.engine.getEcoLevel(this.student.totalCarbonos);
      }
    } else {
      this.student = null;
      this.level = null;
    }
  }

  logout(): void {
    this.storage.clearState();
    this.student = null;
    this.level = null;
    this.isTeacher = false;
    this.router.navigate(['/register']);
  }
}
