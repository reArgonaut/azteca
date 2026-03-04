export type TransportType = 'walking' | 'bicycle' | 'bus' | 'car' | 'motorcycle';
export type ActionType = 'quick' | 'evidence' | 'viral';
export type ActionStatus = 'approved' | 'pending' | 'rejected';

export interface Student {
  id: string;
  nickname: string;
  group: string;
  transport: TransportType;
  travelTime: number;
  transportCost: number;
  totalCarbonos: number;
  createdAt: string;
}

export interface Action {
  id: string;
  studentId: string;
  studentNickname: string;
  studentGroup: string;
  type: ActionType;
  actionId: string;
  title: string;
  carbonos: number;
  status: ActionStatus;
  date: string;
  evidence?: string;
  tiktokLink?: string;
  category?: string;
  description?: string;
}

export interface AppState {
  currentStudentId: string | null;
  isTeacher: boolean;
}

export interface EcoLevel {
  name: string;
  minCarbonos: number;
  icon: string;
  badge: string;
}

export interface GroupRanking {
  group: string;
  totalCarbonos: number;
  studentCount: number;
  position: number;
}
