import {
  Pod,
  Student,
  Parent,
  Supervisor,
  Shuttle,
  TrackingEvent,
  StudentStatus,
  DailyStats,
} from '@/lib/types';

// School location (GEMS Jumeirah Primary School)
export const SCHOOL_LOCATION: [number, number] = [55.2407, 25.1776];

// 5 SafePod locations around Al Safa 1
export const pods: Pod[] = [
  {
    id: 'pod-a',
    name: 'Pod A - Al Wasl',
    location: [55.2325, 25.1820],
    address: 'Al Wasl Road, Near Spinneys',
    capacity: 100,
    currentCount: 45,
    operatingHours: '6:30 AM - 8:30 AM',
    supervisorId: 'sup-1',
    status: 'normal',
  },
  {
    id: 'pod-b',
    name: 'Pod B - Al Safa Park',
    location: [55.2380, 25.1740],
    address: 'Al Safa Park Entrance, Gate 2',
    capacity: 80,
    currentCount: 72,
    operatingHours: '6:30 AM - 8:30 AM',
    supervisorId: 'sup-2',
    status: 'busy',
  },
  {
    id: 'pod-c',
    name: 'Pod C - Jumeirah Beach Rd',
    location: [55.2450, 25.1695],
    address: 'Jumeirah Beach Road, Near Mall',
    capacity: 120,
    currentCount: 108,
    operatingHours: '6:30 AM - 8:30 AM',
    supervisorId: 'sup-3',
    status: 'full',
  },
  {
    id: 'pod-d',
    name: 'Pod D - Emirates Hills',
    location: [55.2280, 25.1855],
    address: 'Emirates Hills, Community Center',
    capacity: 60,
    currentCount: 28,
    operatingHours: '6:30 AM - 8:30 AM',
    supervisorId: 'sup-4',
    status: 'normal',
  },
  {
    id: 'pod-e',
    name: 'Pod E - Sheikh Zayed',
    location: [55.2220, 25.1790],
    address: 'Near Sheikh Zayed Road Exit',
    capacity: 90,
    currentCount: 54,
    operatingHours: '6:30 AM - 8:30 AM',
    supervisorId: 'sup-5',
    status: 'normal',
  },
];

export const supervisors: Supervisor[] = [
  { id: 'sup-1', name: 'Sarah Ahmed', email: 'sarah@safepod.ae', phone: '+971 50 123 4567', assignedPod: 'pod-a' },
  { id: 'sup-2', name: 'Omar Hassan', email: 'omar@safepod.ae', phone: '+971 50 234 5678', assignedPod: 'pod-b' },
  { id: 'sup-3', name: 'Fatima Ali', email: 'fatima@safepod.ae', phone: '+971 50 345 6789', assignedPod: 'pod-c' },
  { id: 'sup-4', name: 'Ahmed Khan', email: 'ahmed@safepod.ae', phone: '+971 50 456 7890', assignedPod: 'pod-d' },
  { id: 'sup-5', name: 'Layla Ibrahim', email: 'layla@safepod.ae', phone: '+971 50 567 8901', assignedPod: 'pod-e' },
];

export const students: Student[] = [
  { id: 's1', name: 'Ahmad Al Maktoum', grade: 'Grade 4', parentId: 'p1', assignedPod: 'pod-b', school: 'GEMS JPS' },
  { id: 's2', name: 'Sara Al Maktoum', grade: 'Grade 2', parentId: 'p1', assignedPod: 'pod-b', school: 'GEMS JPS' },
  { id: 's3', name: 'Mohammed Ali', grade: 'Grade 5', parentId: 'p2', assignedPod: 'pod-a', school: 'GEMS JPS' },
  { id: 's4', name: 'Aisha Rahman', grade: 'Grade 3', parentId: 'p3', assignedPod: 'pod-c', school: 'GEMS JPS' },
  { id: 's5', name: 'Khalid Hassan', grade: 'Grade 6', parentId: 'p4', assignedPod: 'pod-a', school: 'GEMS JPS' },
  { id: 's6', name: 'Noura Said', grade: 'Grade 1', parentId: 'p5', assignedPod: 'pod-d', school: 'GEMS JPS' },
  { id: 's7', name: 'Yousef Ahmed', grade: 'Grade 4', parentId: 'p6', assignedPod: 'pod-e', school: 'GEMS JPS' },
  { id: 's8', name: 'Mariam Khan', grade: 'Grade 3', parentId: 'p7', assignedPod: 'pod-b', school: 'GEMS JPS' },
  { id: 's9', name: 'Hassan Omar', grade: 'Grade 5', parentId: 'p8', assignedPod: 'pod-c', school: 'GEMS JPS' },
  { id: 's10', name: 'Lina Farouk', grade: 'Grade 2', parentId: 'p9', assignedPod: 'pod-a', school: 'GEMS JPS' },
];

export const parents: Parent[] = [
  { id: 'p1', name: 'Rashid Al Maktoum', email: 'rashid@email.com', phone: '+971 50 111 2222', studentIds: ['s1', 's2'] },
  { id: 'p2', name: 'Kareem Ali', email: 'kareem@email.com', phone: '+971 50 222 3333', studentIds: ['s3'] },
  { id: 'p3', name: 'Amina Rahman', email: 'amina@email.com', phone: '+971 50 333 4444', studentIds: ['s4'] },
  { id: 'p4', name: 'Saeed Hassan', email: 'saeed@email.com', phone: '+971 50 444 5555', studentIds: ['s5'] },
  { id: 'p5', name: 'Nadia Said', email: 'nadia@email.com', phone: '+971 50 555 6666', studentIds: ['s6'] },
  { id: 'p6', name: 'Tariq Ahmed', email: 'tariq@email.com', phone: '+971 50 666 7777', studentIds: ['s7'] },
  { id: 'p7', name: 'Reem Khan', email: 'reem@email.com', phone: '+971 50 777 8888', studentIds: ['s8'] },
  { id: 'p8', name: 'Ali Omar', email: 'ali@email.com', phone: '+971 50 888 9999', studentIds: ['s9'] },
  { id: 'p9', name: 'Maya Farouk', email: 'maya@email.com', phone: '+971 50 999 0000', studentIds: ['s10'] },
];

export const shuttles: Shuttle[] = [
  {
    id: 'shuttle-1',
    name: 'Shuttle 1',
    currentLocation: [55.2360, 25.1750],
    capacity: 30,
    currentStudents: ['s1', 's2', 's8'],
    status: 'en_route_to_school',
    destination: 'GEMS JPS',
    eta: 8,
  },
  {
    id: 'shuttle-2',
    name: 'Shuttle 2',
    currentLocation: [55.2330, 25.1815],
    capacity: 30,
    currentStudents: ['s3', 's5', 's10'],
    status: 'loading',
    destination: 'Pod A',
    eta: 0,
  },
  {
    id: 'shuttle-3',
    name: 'Shuttle 3',
    currentLocation: [55.2440, 25.1710],
    capacity: 30,
    currentStudents: ['s4', 's9'],
    status: 'en_route_to_school',
    destination: 'GEMS JPS',
    eta: 5,
  },
  {
    id: 'shuttle-4',
    name: 'Shuttle 4',
    currentLocation: [55.2290, 25.1845],
    capacity: 30,
    currentStudents: ['s6'],
    status: 'en_route_to_pod',
    destination: 'Pod D',
    eta: 3,
  },
  {
    id: 'shuttle-5',
    name: 'Shuttle 5',
    currentLocation: [55.2407, 25.1776],
    capacity: 30,
    currentStudents: [],
    status: 'at_school',
    destination: 'Pod E',
    eta: 0,
  },
];

// Generate today's date for events
const today = new Date().toISOString().split('T')[0];

export const events: TrackingEvent[] = [
  // Ahmad's journey (student s1) - currently on shuttle to school
  { id: 'e1', studentId: 's1', type: 'left_home', timestamp: `${today}T07:15:00`, notes: 'Parent confirmed departure' },
  { id: 'e2', studentId: 's1', type: 'pod_checkin', timestamp: `${today}T07:32:00`, podId: 'pod-b' },
  { id: 'e3', studentId: 's1', type: 'shuttle_board', timestamp: `${today}T07:38:00`, shuttleId: 'shuttle-1', podId: 'pod-b' },
  { id: 'e4', studentId: 's1', type: 'shuttle_depart', timestamp: `${today}T07:42:00`, shuttleId: 'shuttle-1' },

  // Sara's journey (student s2) - same shuttle as Ahmad
  { id: 'e5', studentId: 's2', type: 'left_home', timestamp: `${today}T07:15:00` },
  { id: 'e6', studentId: 's2', type: 'pod_checkin', timestamp: `${today}T07:32:00`, podId: 'pod-b' },
  { id: 'e7', studentId: 's2', type: 'shuttle_board', timestamp: `${today}T07:38:00`, shuttleId: 'shuttle-1', podId: 'pod-b' },
  { id: 'e8', studentId: 's2', type: 'shuttle_depart', timestamp: `${today}T07:42:00`, shuttleId: 'shuttle-1' },

  // Mohammed's journey (student s3) - at pod, waiting for shuttle
  { id: 'e9', studentId: 's3', type: 'left_home', timestamp: `${today}T07:25:00` },
  { id: 'e10', studentId: 's3', type: 'pod_checkin', timestamp: `${today}T07:40:00`, podId: 'pod-a' },

  // Aisha's journey (student s4) - on shuttle
  { id: 'e11', studentId: 's4', type: 'left_home', timestamp: `${today}T07:10:00` },
  { id: 'e12', studentId: 's4', type: 'pod_checkin', timestamp: `${today}T07:28:00`, podId: 'pod-c' },
  { id: 'e13', studentId: 's4', type: 'shuttle_board', timestamp: `${today}T07:35:00`, shuttleId: 'shuttle-3', podId: 'pod-c' },
  { id: 'e14', studentId: 's4', type: 'shuttle_depart', timestamp: `${today}T07:40:00`, shuttleId: 'shuttle-3' },

  // Some historical events from yesterday
  { id: 'e15', studentId: 's1', type: 'school_arrival', timestamp: `${new Date(Date.now() - 86400000).toISOString().split('T')[0]}T07:52:00` },
  { id: 'e16', studentId: 's2', type: 'school_arrival', timestamp: `${new Date(Date.now() - 86400000).toISOString().split('T')[0]}T07:52:00` },
];

// Current status for each student (derived from events)
export const studentStatuses: StudentStatus[] = [
  { studentId: 's1', currentLocation: 'on_shuttle', currentShuttleId: 'shuttle-1', eta: 8, lastEvent: events[3] },
  { studentId: 's2', currentLocation: 'on_shuttle', currentShuttleId: 'shuttle-1', eta: 8, lastEvent: events[7] },
  { studentId: 's3', currentLocation: 'at_pod', currentPodId: 'pod-a', eta: 15, lastEvent: events[9] },
  { studentId: 's4', currentLocation: 'on_shuttle', currentShuttleId: 'shuttle-3', eta: 5, lastEvent: events[13] },
  { studentId: 's5', currentLocation: 'at_pod', currentPodId: 'pod-a', eta: 15, lastEvent: events[9] },
  { studentId: 's6', currentLocation: 'en_route_to_pod', currentPodId: 'pod-d', eta: 20 },
  { studentId: 's7', currentLocation: 'home', eta: 30 },
  { studentId: 's8', currentLocation: 'on_shuttle', currentShuttleId: 'shuttle-1', eta: 8 },
  { studentId: 's9', currentLocation: 'on_shuttle', currentShuttleId: 'shuttle-3', eta: 5 },
  { studentId: 's10', currentLocation: 'at_pod', currentPodId: 'pod-a', eta: 15 },
];

// Weekly stats for analytics
export const weeklyStats: DailyStats[] = [
  {
    date: '2024-01-15',
    totalStudents: 487,
    onTimeArrivals: 462,
    lateArrivals: 25,
    avgWaitTime: 4.2,
    peakHour: '7:45 AM',
    podStats: [
      { podId: 'pod-a', throughput: 98, avgWaitTime: 3.8 },
      { podId: 'pod-b', throughput: 78, avgWaitTime: 4.5 },
      { podId: 'pod-c', throughput: 115, avgWaitTime: 5.2 },
      { podId: 'pod-d', throughput: 58, avgWaitTime: 3.2 },
      { podId: 'pod-e', throughput: 88, avgWaitTime: 4.0 },
    ],
  },
  {
    date: '2024-01-16',
    totalStudents: 492,
    onTimeArrivals: 478,
    lateArrivals: 14,
    avgWaitTime: 3.8,
    peakHour: '7:50 AM',
    podStats: [
      { podId: 'pod-a', throughput: 102, avgWaitTime: 3.5 },
      { podId: 'pod-b', throughput: 80, avgWaitTime: 4.0 },
      { podId: 'pod-c', throughput: 118, avgWaitTime: 4.8 },
      { podId: 'pod-d', throughput: 55, avgWaitTime: 2.9 },
      { podId: 'pod-e', throughput: 87, avgWaitTime: 3.7 },
    ],
  },
  {
    date: '2024-01-17',
    totalStudents: 475,
    onTimeArrivals: 458,
    lateArrivals: 17,
    avgWaitTime: 4.0,
    peakHour: '7:48 AM',
    podStats: [
      { podId: 'pod-a', throughput: 95, avgWaitTime: 3.6 },
      { podId: 'pod-b', throughput: 76, avgWaitTime: 4.3 },
      { podId: 'pod-c', throughput: 112, avgWaitTime: 5.0 },
      { podId: 'pod-d', throughput: 60, avgWaitTime: 3.4 },
      { podId: 'pod-e', throughput: 82, avgWaitTime: 3.9 },
    ],
  },
];

// Helper functions
export function getPodById(id: string): Pod | undefined {
  return pods.find(p => p.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getParentById(id: string): Parent | undefined {
  return parents.find(p => p.id === id);
}

export function getSupervisorById(id: string): Supervisor | undefined {
  return supervisors.find(s => s.id === id);
}

export function getShuttleById(id: string): Shuttle | undefined {
  return shuttles.find(s => s.id === id);
}

export function getStudentsByPod(podId: string): Student[] {
  return students.filter(s => s.assignedPod === podId);
}

export function getStudentsByParent(parentId: string): Student[] {
  return students.filter(s => s.parentId === parentId);
}

export function getEventsForStudent(studentId: string): TrackingEvent[] {
  return events.filter(e => e.studentId === studentId).sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getStatusForStudent(studentId: string): StudentStatus | undefined {
  return studentStatuses.find(s => s.studentId === studentId);
}

export function getStudentsAtPod(podId: string): Student[] {
  const atPod = studentStatuses.filter(s => s.currentLocation === 'at_pod' && s.currentPodId === podId);
  return atPod.map(s => getStudentById(s.studentId)!).filter(Boolean);
}

// Mock current user (parent with student s1 and s2)
export const currentParent = parents[0]; // Rashid Al Maktoum
export const currentSupervisor = supervisors[1]; // Omar Hassan (Pod B)

// Mapbox token (reused from simulation)
export const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGVhdGhoYW1vb2QxIiwiYSI6ImNtbDF5aXo0cTA5cTIzZ3NkcDVqaGcwaTQifQ.yzJJKKvc0GrMIiTn_P8zdA';
