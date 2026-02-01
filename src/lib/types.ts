// TypeScript interfaces for SafePod Management System

export interface Pod {
  id: string;
  name: string;
  location: [number, number]; // [lng, lat]
  address: string;
  capacity: number;
  currentCount: number;
  operatingHours: string;
  supervisorId: string;
  status: 'normal' | 'busy' | 'full';
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  parentId: string;
  assignedPod: string;
  school: string;
  photoUrl?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentIds: string[];
}

export interface Supervisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  assignedPod: string;
}

export interface Shuttle {
  id: string;
  name: string;
  currentLocation: [number, number];
  capacity: number;
  currentStudents: string[];
  status: 'en_route_to_pod' | 'loading' | 'en_route_to_school' | 'at_school' | 'idle';
  destination: string;
  eta?: number; // minutes
}

export type EventType =
  | 'left_home'
  | 'pod_checkin'
  | 'shuttle_board'
  | 'shuttle_depart'
  | 'school_arrival'
  | 'parent_pickup'
  | 'checked_out';

export interface TrackingEvent {
  id: string;
  studentId: string;
  type: EventType;
  timestamp: string;
  podId?: string;
  shuttleId?: string;
  notes?: string;
}

export interface StudentStatus {
  studentId: string;
  currentLocation: 'home' | 'en_route_to_pod' | 'at_pod' | 'on_shuttle' | 'at_school' | 'picked_up';
  currentPodId?: string;
  currentShuttleId?: string;
  eta?: number;
  lastEvent?: TrackingEvent;
}

export type UserRole = 'parent' | 'admin' | 'supervisor';

export interface DailyStats {
  date: string;
  totalStudents: number;
  onTimeArrivals: number;
  lateArrivals: number;
  avgWaitTime: number;
  peakHour: string;
  podStats: {
    podId: string;
    throughput: number;
    avgWaitTime: number;
  }[];
}
