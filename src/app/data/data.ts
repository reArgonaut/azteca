import type { EcoLevel, TransportType } from '../models/models';

// ── Motor de reglas del sistema ────────────────────────────────────────────

export const TRANSPORT_RATES: Record<TransportType, number> = {
  walking: 0,      // 0 carbonos / min
  bicycle: 0.2,    // 0.2 carbonos / min
  bus: 1.5,        // 1.5 carbonos / min
  car: 3.0,        // 3.0 carbonos / min
  motorcycle: 2.0, // 2.0 carbonos / min
};

export const TRANSPORT_LABELS: Record<TransportType, string> = {
  walking: '🚶 A pie',
  bicycle: '🚲 Bicicleta',
  bus: '🚌 Transporte público',
  car: '🚗 Auto particular',
  motorcycle: '🏍️ Moto',
};

export const TRANSPORT_OPTIONS: { value: TransportType; label: string }[] = [
  { value: 'walking', label: '🚶 A pie' },
  { value: 'bicycle', label: '🚲 Bicicleta' },
  { value: 'bus', label: '🚌 Transporte público' },
  { value: 'car', label: '🚗 Auto particular' },
  { value: 'motorcycle', label: '🏍️ Moto' },
];

// ── Acciones rápidas (sin evidencia, máx 2/día) ────────────────────────────

export const QUICK_ACTIONS = [
  { id: 'termo', title: 'Traje termo reutilizable', carbonos: 10, icon: '🧉' },
  { id: 'residuos', title: 'Separé residuos correctamente', carbonos: 8, icon: '♻️' },
  { id: 'desechables', title: 'Evité productos desechables', carbonos: 12, icon: '🚫' },
];

// ── Acciones con evidencia (requieren validación docente) ──────────────────

export const EVIDENCE_ACTIONS = [
  { id: 'actividad', title: 'Participé en actividad ecológica', carbonos: 50, icon: '🌱' },
  { id: 'reciclaje', title: 'Entregué materiales de reciclaje', carbonos: 40, icon: '♻️' },
  { id: 'mejora', title: 'Propuse mejora ambiental', carbonos: 60, icon: '💡' },
];

// ── Categorías para contenido viral ───────────────────────────────────────

export const VIRAL_CATEGORIES = [
  'Reciclaje',
  'Energía renovable',
  'Biodiversidad',
  'Agua',
  'Transporte sostenible',
  'Alimentación consciente',
  'Otro',
];

// ── Sistema de niveles ecológicos ─────────────────────────────────────────

export const ECO_LEVELS: EcoLevel[] = [
  { name: 'Aprendiz del Equilibrio', minCarbonos: 0,   icon: '🌱', badge: 'success' },
  { name: 'Ecólogo Local',           minCarbonos: 100, icon: '🌿', badge: 'info'    },
  { name: 'Guardián Verde',          minCarbonos: 300, icon: '🌳', badge: 'primary' },
  { name: 'Protector del Ecosistema',minCarbonos: 600, icon: '🌍', badge: 'warning' },
];

// ── Constantes del sistema ─────────────────────────────────────────────────

export const BASE_DAILY_CONSUMPTION = 50;   // Consumo base diario en carbonos
export const MAX_QUICK_ACTIONS_PER_DAY = 2; // Máximo de acciones rápidas
export const REJECTION_PENALTY = 10;        // Penalización privada por rechazo
export const VIRAL_BASE_CARBONOS = 30;      // Carbonos base por contenido viral
export const TEACHER_PASSWORD = 'azteca2025';
