'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusTimeline, locationToStage } from '@/components/shared/StatusTimeline';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ParentTrackingMap } from '@/components/shared/ParentTrackingMap';
import { toast } from 'sonner';
import {
  currentParent,
  students,
  getPodById,
} from '@/data/mock-data';

// Simulated journey stages
type JourneyStage = 'at_pod' | 'on_shuttle' | 'at_school';

export default function ParentDashboard() {
  const [selectedStudent, setSelectedStudent] = useState(currentParent.studentIds[0]);
  const [currentStage, setCurrentStage] = useState<JourneyStage>('on_shuttle');
  const [shuttleProgress, setShuttleProgress] = useState(0.3);
  const [eta, setEta] = useState(8);
  const [recentEvents, setRecentEvents] = useState<Array<{ id: string; type: string; time: Date }>>([]);

  const student = students.find((s) => s.id === selectedStudent)!;
  const pod = getPodById(student.assignedPod);

  // Simulate journey progression
  useEffect(() => {
    // Start with some events
    setRecentEvents([
      { id: '1', type: 'pod_checkin', time: new Date(Date.now() - 15 * 60000) },
      { id: '2', type: 'shuttle_board', time: new Date(Date.now() - 8 * 60000) },
    ]);

    // Animate shuttle progress
    const progressInterval = setInterval(() => {
      setShuttleProgress(prev => {
        const newProgress = prev + 0.008;
        if (newProgress >= 1) {
          setCurrentStage('at_school');
          setEta(0);
          setRecentEvents(prev => [
            { id: Date.now().toString(), type: 'school_arrival', time: new Date() },
            ...prev,
          ]);
          clearInterval(progressInterval);
          return 1;
        }
        return newProgress;
      });

      setEta(prev => Math.max(0, prev - 0.08));
    }, 500);

    return () => clearInterval(progressInterval);
  }, [selectedStudent]);

  const handleRunningLate = () => {
    toast.success('Notification sent', {
      description: "We've notified the pod supervisor that you're running late.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Good Morning!</h1>
        <p className="text-sm sm:text-base text-slate-600">Track {student.name}'s journey to school in real-time.</p>
      </div>

      {/* Student Selector (if multiple children) */}
      {currentParent.studentIds.length > 1 && (
        <div className="flex gap-2">
          {currentParent.studentIds.map((sid) => {
            const s = students.find((st) => st.id === sid)!;
            const isSelected = sid === selectedStudent;
            return (
              <Button
                key={sid}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedStudent(sid);
                  setShuttleProgress(Math.random() * 0.5 + 0.2);
                  setCurrentStage('on_shuttle');
                  setEta(Math.floor(Math.random() * 10) + 3);
                }}
                className={isSelected ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              >
                {s.name}
              </Button>
            );
          })}
        </div>
      )}

      {/* Main Status Card */}
      <Card className="border-0 shadow-lg bg-white overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                {student.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl">{student.name}</CardTitle>
                <CardDescription>{student.grade} • {student.school}</CardDescription>
              </div>
            </div>
            <StatusBadge
              status={currentStage}
              podName={pod?.name.split(' - ')[0]}
              shuttleName="Shuttle 1"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeline with inline progress - like delivery apps */}
          <div className="py-4">
            <StatusTimeline
              currentStage={locationToStage(currentStage)}
              podName={pod?.name.split(' - ')[0]}
              shuttleName="Shuttle 1"
              shuttleProgress={shuttleProgress}
            />
          </div>

          {/* Live Map Tracking */}
          {currentStage === 'on_shuttle' && pod && (
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <ParentTrackingMap
                podId={pod.id}
                shuttleProgress={shuttleProgress}
                className="w-full h-[200px] sm:h-[250px]"
              />
            </div>
          )}

          {/* ETA Card */}
          {currentStage === 'on_shuttle' && eta > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-emerald-700">Estimated arrival</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-900">~{Math.ceil(eta)} min</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-200 text-xs">
                  On Track
                </Badge>
              </div>
            </div>
          )}

          {currentStage === 'at_school' && (
            <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-700">Arrived safely at school</p>
                <p className="text-xl font-bold text-green-900">Have a great day!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  event.type === 'school_arrival' ? 'bg-green-50 border border-green-200' : 'bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  event.type === 'school_arrival' ? 'bg-green-500 text-white' : 'bg-white text-slate-600'
                }`}>
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${event.type === 'school_arrival' ? 'text-green-900' : 'text-slate-900'}`}>
                    {getEventLabel(event.type)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTime(event.time)}
                  </p>
                </div>
                {event.type === 'school_arrival' && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">New</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleRunningLate}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Running Late
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            if (pod) {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${pod.location[1]},${pod.location[0]}`,
                '_blank'
              );
            }
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          Directions to Pod
        </Button>
      </div>
    </div>
  );
}

function getEventIcon(type: string) {
  switch (type) {
    case 'pod_checkin':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      );
    case 'shuttle_board':
    case 'shuttle_depart':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      );
    case 'school_arrival':
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

function getEventLabel(type: string): string {
  switch (type) {
    case 'pod_checkin':
      return 'Checked in at Pod B';
    case 'shuttle_board':
      return 'Boarded Shuttle 1';
    case 'shuttle_depart':
      return 'Shuttle departed';
    case 'school_arrival':
      return 'Arrived at school safely';
    case 'parent_pickup':
      return 'Picked up by parent';
    default:
      return type;
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
