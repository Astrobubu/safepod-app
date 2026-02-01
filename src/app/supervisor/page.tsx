'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  currentSupervisor,
  getPodById,
} from '@/data/mock-data';

// Simulated student names for NFC check-ins
const STUDENT_NAMES = [
  'Omar Hassan', 'Fatima Al-Ali', 'Ahmed Khan', 'Layla Ibrahim', 'Yousef Said',
  'Mariam Farouk', 'Khalid Rahman', 'Noura Ahmed', 'Hassan Omar', 'Aisha Malik',
  'Tariq Ali', 'Reem Hassan', 'Zayed Al-Maktoum', 'Sara Khan', 'Ali Rashid',
  'Hind Al-Saud', 'Mohammed Farah', 'Jana Ibrahim', 'Faisal Ahmed', 'Lina Yousef',
];

const GRADES = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

interface CheckedInStudent {
  id: string;
  name: string;
  grade: string;
  checkInTime: Date;
  status: 'waiting' | 'boarding' | 'boarded';
}

// Generate initial students outside component to avoid duplicates
const generateInitialStudents = (): CheckedInStudent[] => {
  return [0, 1, 2].map((i) => ({
    id: `initial-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
    name: STUDENT_NAMES[i],
    grade: GRADES[Math.floor(Math.random() * GRADES.length)],
    checkInTime: new Date(Date.now() - (i + 1) * 60000),
    status: 'waiting' as const,
  }));
};

export default function SupervisorPodPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedInStudents, setCheckedInStudents] = useState<CheckedInStudent[]>(() => generateInitialStudents());
  const [nextShuttleEta, setNextShuttleEta] = useState(4);
  const [isShuttleLoading, setIsShuttleLoading] = useState(false);
  const [totalBoarded, setTotalBoarded] = useState(0);
  const [nfcAnimation, setNfcAnimation] = useState(false);
  const studentCounterRef = useRef(0);

  const pod = getPodById(currentSupervisor.assignedPod)!;

  // Simulate NFC check-ins every 2-5 seconds
  useEffect(() => {
    const addRandomStudent = () => {
      const name = STUDENT_NAMES[Math.floor(Math.random() * STUDENT_NAMES.length)];
      const grade = GRADES[Math.floor(Math.random() * GRADES.length)];
      studentCounterRef.current += 1;
      const id = `nfc-${Date.now()}-${studentCounterRef.current}`;

      setNfcAnimation(true);
      setTimeout(() => setNfcAnimation(false), 500);

      const newStudent: CheckedInStudent = {
        id,
        name,
        grade,
        checkInTime: new Date(),
        status: 'waiting',
      };

      setCheckedInStudents(prev => [newStudent, ...prev]);

      toast.success('NFC Check-in', {
        description: `${name} (${grade}) checked in`,
        duration: 2000,
      });
    };

    // Random check-ins
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance of check-in
        addRandomStudent();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Shuttle ETA countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNextShuttleEta(prev => {
        if (prev <= 0) {
          setIsShuttleLoading(true);
          return 0;
        }
        return prev - 1/60; // Decrease by 1 second
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-board students when shuttle is loading
  useEffect(() => {
    if (!isShuttleLoading) return;

    const boardStudents = () => {
      setCheckedInStudents(prev => {
        const waiting = prev.filter(s => s.status === 'waiting');
        if (waiting.length === 0) return prev;

        // Board one student
        const studentToBoard = waiting[0];
        return prev.map(s =>
          s.id === studentToBoard.id ? { ...s, status: 'boarding' as const } : s
        );
      });
    };

    const interval = setInterval(boardStudents, 800);

    // Remove boarded students after animation
    const cleanupInterval = setInterval(() => {
      setCheckedInStudents(prev => {
        const boarding = prev.filter(s => s.status === 'boarding');
        if (boarding.length > 0) {
          setTotalBoarded(t => t + 1);
          return prev.filter(s => s.status !== 'boarding');
        }
        return prev;
      });
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(cleanupInterval);
    };
  }, [isShuttleLoading]);

  const handleDispatchShuttle = useCallback(() => {
    setIsShuttleLoading(false);
    setNextShuttleEta(4);
    toast.success('Shuttle Dispatched', {
      description: 'Shuttle is now heading to school.',
    });
  }, []);

  const handleManualCheckIn = () => {
    const name = STUDENT_NAMES[Math.floor(Math.random() * STUDENT_NAMES.length)];
    const grade = GRADES[Math.floor(Math.random() * GRADES.length)];
    const newStudent: CheckedInStudent = {
      id: `manual-${Date.now()}`,
      name,
      grade,
      checkInTime: new Date(),
      status: 'waiting',
    };
    setCheckedInStudents(prev => [newStudent, ...prev]);
    toast.success('Manual Check-in', {
      description: `${name} checked in manually`,
    });
  };

  const waitingStudents = checkedInStudents.filter(s => s.status === 'waiting');
  const boardingStudents = checkedInStudents.filter(s => s.status === 'boarding');

  const statusColor = waitingStudents.length > 20
    ? 'bg-red-500'
    : waitingStudents.length > 10
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="space-y-6">
      {/* Header with Pod Name and Time */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{pod.name}</h1>
          <p className="text-slate-600">{currentSupervisor.name} - Supervisor</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-mono font-bold text-slate-900">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </p>
          <p className="text-sm text-slate-500">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* NFC Animation Indicator */}
      {nfcAnimation && (
        <div className="fixed top-20 right-4 z-50 animate-pulse">
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
            NFC Scan
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full ${statusColor} mx-auto flex items-center justify-center text-white mb-2 transition-all duration-300`}>
                <span className="text-2xl font-bold">{waitingStudents.length}</span>
              </div>
              <p className="text-sm text-slate-500">Waiting</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500 mx-auto flex items-center justify-center text-white mb-2">
                <span className="text-2xl font-bold">{boardingStudents.length}</span>
              </div>
              <p className="text-sm text-slate-500">Boarding</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500 mx-auto flex items-center justify-center text-white mb-2">
                <span className="text-2xl font-bold">{totalBoarded}</span>
              </div>
              <p className="text-sm text-slate-500">Boarded Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full ${isShuttleLoading ? 'bg-amber-500 animate-pulse' : 'bg-blue-100'} mx-auto flex items-center justify-center ${isShuttleLoading ? 'text-white' : 'text-blue-600'} mb-2`}>
                <span className="text-xl font-bold">
                  {isShuttleLoading ? 'NOW' : Math.ceil(nextShuttleEta * 60) + 's'}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                {isShuttleLoading ? 'Loading' : 'Next Shuttle'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shuttle Status */}
      <Card className={`border-0 shadow-lg ${isShuttleLoading ? 'bg-amber-50 border-2 border-amber-300' : 'bg-blue-50'}`}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isShuttleLoading ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                <svg className={`w-6 h-6 ${isShuttleLoading ? 'animate-bounce' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <p className={`font-semibold text-lg ${isShuttleLoading ? 'text-amber-900' : 'text-blue-900'}`}>
                  {isShuttleLoading ? 'Shuttle Loading - Students Boarding' : 'Shuttle 3 En Route'}
                </p>
                <p className={`text-sm ${isShuttleLoading ? 'text-amber-700' : 'text-blue-700'}`}>
                  {isShuttleLoading
                    ? `${boardingStudents.length} students boarding now`
                    : `Arriving in ${Math.ceil(nextShuttleEta)} minutes`
                  }
                </p>
              </div>
            </div>
            {isShuttleLoading && (
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={handleDispatchShuttle}
                disabled={waitingStudents.length > 0 || boardingStudents.length > 0}
              >
                Dispatch Shuttle
              </Button>
            )}
          </div>

          {/* Loading progress */}
          {isShuttleLoading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-amber-700 mb-1">
                <span>Loading Progress</span>
                <span>{Math.min(30, 30 - waitingStudents.length)}/30 seats</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, ((30 - waitingStudents.length) / 30) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            Students at Pod ({waitingStudents.length + boardingStudents.length})
          </CardTitle>
          <Button variant="outline" onClick={handleManualCheckIn}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Manual Check-in
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {checkedInStudents.map((student) => (
              <div
                key={student.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  student.status === 'boarding'
                    ? 'bg-blue-100 border-2 border-blue-300 animate-pulse translate-x-2'
                    : 'bg-slate-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all ${
                  student.status === 'boarding'
                    ? 'bg-blue-500'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500'
                }`}>
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{student.name}</p>
                  <p className="text-sm text-slate-500">
                    {student.grade} • Checked in {formatTimeAgo(student.checkInTime)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    student.status === 'boarding'
                      ? 'bg-blue-100 text-blue-700 border-blue-300 animate-pulse'
                      : 'bg-amber-100 text-amber-700 border-amber-200'
                  }
                >
                  {student.status === 'boarding' ? 'Boarding...' : 'Waiting'}
                </Badge>
              </div>
            ))}

            {checkedInStudents.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <p>Waiting for students to check in...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="h-16"
          onClick={() => toast.info('Reporting issue', { description: 'Opening issue report form...' })}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Report Issue
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-16"
          onClick={() => toast.info('Contacting admin', { description: 'Opening chat with admin...' })}
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          Contact Admin
        </Button>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 120) return '1 min ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
