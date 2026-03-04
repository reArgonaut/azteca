import { Action, Student } from '../models/models';
import { StorageService } from '../services/storage.service';

// ── seed.ts — Datos iniciales para la demo ────────────────────────────────

export function seedDemoData(storage: StorageService): void {
  if (storage.isSeeded()) return;

  const today = new Date().toISOString().split('T')[0];

  // ── Estudiantes demo ────────────────────────────────────────────────────

  const students: Student[] = [
    {
      id: 'demo-1',
      nickname: 'EcoMaria',
      group: 'Grupo A',
      transport: 'bicycle',
      travelTime: 15,
      transportCost: 3,   // 0.2 * 15
      totalCarbonos: 68,
      createdAt: today,
    },
    {
      id: 'demo-2',
      nickname: 'CarlosVerde',
      group: 'Grupo B',
      transport: 'bus',
      travelTime: 30,
      transportCost: 45,  // 1.5 * 30
      totalCarbonos: 100,
      createdAt: today,
    },
    {
      id: 'demo-3',
      nickname: 'AnaEco',
      group: 'Grupo A',
      transport: 'walking',
      travelTime: 20,
      transportCost: 0,
      totalCarbonos: 22,
      createdAt: today,
    },
  ];

  // ── Acciones demo (aprobadas) ────────────────────────────────────────────

  const actions: Action[] = [
    // EcoMaria — Grupo A
    {
      id: 'a-1', studentId: 'demo-1', studentNickname: 'EcoMaria',
      studentGroup: 'Grupo A', type: 'quick', actionId: 'termo',
      title: 'Traje termo reutilizable', carbonos: 10,
      status: 'approved', date: today,
    },
    {
      id: 'a-2', studentId: 'demo-1', studentNickname: 'EcoMaria',
      studentGroup: 'Grupo A', type: 'quick', actionId: 'residuos',
      title: 'Separé residuos correctamente', carbonos: 8,
      status: 'approved', date: today,
    },
    {
      id: 'a-3', studentId: 'demo-1', studentNickname: 'EcoMaria',
      studentGroup: 'Grupo A', type: 'evidence', actionId: 'actividad',
      title: 'Participé en actividad ecológica', carbonos: 50,
      status: 'approved', date: today,
      evidence: 'Foto del evento de reforestación del campus',
    },

    // CarlosVerde — Grupo B
    {
      id: 'a-4', studentId: 'demo-2', studentNickname: 'CarlosVerde',
      studentGroup: 'Grupo B', type: 'quick', actionId: 'termo',
      title: 'Traje termo reutilizable', carbonos: 10,
      status: 'approved', date: today,
    },
    {
      id: 'a-5', studentId: 'demo-2', studentNickname: 'CarlosVerde',
      studentGroup: 'Grupo B', type: 'evidence', actionId: 'mejora',
      title: 'Propuse mejora ambiental', carbonos: 60,
      status: 'approved', date: today,
      evidence: 'Propuesta de paneles solares en el techo del aula',
    },
    {
      id: 'a-6', studentId: 'demo-2', studentNickname: 'CarlosVerde',
      studentGroup: 'Grupo B', type: 'viral', actionId: 'viral',
      title: 'TikTok ambiental — Energía renovable', carbonos: 30,
      status: 'approved', date: today,
      tiktokLink: 'https://tiktok.com/@carlosverde',
      category: 'Energía renovable',
      description: 'Explicando cómo funciona la energía solar en casa',
    },

    // AnaEco — Grupo A
    {
      id: 'a-7', studentId: 'demo-3', studentNickname: 'AnaEco',
      studentGroup: 'Grupo A', type: 'quick', actionId: 'termo',
      title: 'Traje termo reutilizable', carbonos: 10,
      status: 'approved', date: today,
    },
    {
      id: 'a-8', studentId: 'demo-3', studentNickname: 'AnaEco',
      studentGroup: 'Grupo A', type: 'quick', actionId: 'desechables',
      title: 'Evité productos desechables', carbonos: 12,
      status: 'approved', date: today,
    },

    // ── Acciones pendientes (para demo del panel docente) ─────────────────
    {
      id: 'p-1', studentId: 'demo-2', studentNickname: 'CarlosVerde',
      studentGroup: 'Grupo B', type: 'evidence', actionId: 'reciclaje',
      title: 'Entregué materiales de reciclaje', carbonos: 40,
      status: 'pending', date: today,
      evidence: 'Bolsas de plástico, vidrio y papel entregadas al centro de acopio',
    },
    {
      id: 'p-2', studentId: 'demo-3', studentNickname: 'AnaEco',
      studentGroup: 'Grupo A', type: 'evidence', actionId: 'actividad',
      title: 'Participé en actividad ecológica', carbonos: 50,
      status: 'pending', date: today,
      evidence: 'Taller de compostaje en el salón 3B',
    },
    {
      id: 'p-3', studentId: 'demo-1', studentNickname: 'EcoMaria',
      studentGroup: 'Grupo A', type: 'viral', actionId: 'viral',
      title: 'TikTok ambiental — Reciclaje', carbonos: 30,
      status: 'pending', date: today,
      tiktokLink: 'https://tiktok.com/@ecomaria',
      category: 'Reciclaje',
      description: 'Cómo reciclar correctamente en casa en 60 segundos',
    },
  ];

  students.forEach(s => storage.saveStudent(s));
  actions.forEach(a => storage.saveAction(a));
  storage.markSeeded();
}
