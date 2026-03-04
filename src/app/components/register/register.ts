import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TRANSPORT_OPTIONS } from '../../data/data';
import { TransportType, Student } from '../../models/models';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent implements OnInit {
  nickname = '';
  group = '';
  transport: TransportType = 'bus';
  travelTime = 30;

  transportOptions = TRANSPORT_OPTIONS;
  existingStudents: Student[] = [];
  error = '';

  constructor(
    private storage: StorageService,
    private engine: EngineService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.existingStudents = this.storage.getStudents();
    // If already logged in, redirect
    const state = this.storage.getState();
    if (state.currentStudentId) {
      this.router.navigate(['/dashboard']);
    }
  }

  get transportCost(): number {
    return this.engine.calculateTransportCost(this.transport, this.travelTime);
  }

  register(): void {
    this.error = '';
    if (!this.nickname.trim() || !this.group.trim()) {
      this.error = 'Nickname y grupo son obligatorios.';
      return;
    }
    if (this.travelTime < 0 || this.travelTime > 300) {
      this.error = 'El tiempo de traslado debe estar entre 0 y 300 minutos.';
      return;
    }

    const student: Student = {
      id: crypto.randomUUID(),
      nickname: this.nickname.trim(),
      group: this.group.trim(),
      transport: this.transport,
      travelTime: this.travelTime,
      transportCost: this.transportCost,
      totalCarbonos: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    this.storage.saveStudent(student);
    this.storage.setState({ currentStudentId: student.id, isTeacher: false });
    this.router.navigate(['/dashboard']);
  }

  loginAs(student: Student): void {
    this.storage.setState({ currentStudentId: student.id, isTeacher: false });
    this.router.navigate(['/dashboard']);
  }
}
