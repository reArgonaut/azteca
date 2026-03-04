import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VIRAL_BASE_CARBONOS, VIRAL_CATEGORIES } from '../../data/data';
import { Action, Student } from '../../models/models';
import { EngineService } from '../../services/engine.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-viral',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './viral.html',
})
export class ViralComponent implements OnInit {
  student!: Student;
  myPosts: Action[] = [];

  tiktokLink = '';
  category = '';
  description = '';
  categories = VIRAL_CATEGORIES;
  baseCarbonos = VIRAL_BASE_CARBONOS;

  success = '';
  error = '';
  today = '';

  constructor(
    private storage: StorageService,
    private engine: EngineService,
  ) {}

  ngOnInit(): void {
    this.today = this.engine.today();
    const state = this.storage.getState();
    this.student = this.storage.getStudentById(state.currentStudentId!)!;
    this.loadPosts();
  }

  loadPosts(): void {
    this.myPosts = this.storage.getActionsByStudent(this.student.id)
      .filter(a => a.type === 'viral')
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  submit(): void {
    this.success = '';
    this.error = '';

    if (!this.tiktokLink.trim()) {
      this.error = 'El link de TikTok es obligatorio.';
      return;
    }
    if (!this.category) {
      this.error = 'Selecciona una categoría.';
      return;
    }
    if (!this.description.trim()) {
      this.error = 'La descripción es obligatoria.';
      return;
    }

    const action: Action = {
      id: crypto.randomUUID(),
      studentId: this.student.id,
      studentNickname: this.student.nickname,
      studentGroup: this.student.group,
      type: 'viral',
      actionId: 'viral',
      title: `TikTok ambiental — ${this.category}`,
      carbonos: this.baseCarbonos,
      status: 'pending',
      date: this.today,
      tiktokLink: this.tiktokLink.trim(),
      category: this.category,
      description: this.description.trim(),
    };

    this.storage.saveAction(action);
    this.tiktokLink = '';
    this.category = '';
    this.description = '';
    this.success = '🎵 TikTok enviado. El docente lo revisará pronto.';
    this.loadPosts();
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
