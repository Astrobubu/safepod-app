'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  currentParent,
  students,
  events,
} from '@/data/mock-data';
import { TrackingEvent } from '@/lib/types';

// Generate mock historical data for the past 7 days
function generateHistoricalEvents(): Record<string, TrackingEvent[]> {
  const history: Record<string, TrackingEvent[]> = {};
  const studentIds = currentParent.studentIds;

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    history[dateStr] = [];

    studentIds.forEach((studentId, idx) => {
      // Randomize times slightly for each student
      const baseHour = 7;
      const baseMinute = 30 + (idx * 5) + Math.floor(Math.random() * 15);

      const checkInTime = new Date(date);
      checkInTime.setHours(baseHour, baseMinute, 0);

      const boardTime = new Date(checkInTime);
      boardTime.setMinutes(boardTime.getMinutes() + 8 + Math.floor(Math.random() * 5));

      const arrivalTime = new Date(boardTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + 12 + Math.floor(Math.random() * 5));

      history[dateStr].push(
        {
          id: `hist-${dateStr}-${studentId}-1`,
          studentId,
          type: 'pod_checkin',
          timestamp: checkInTime.toISOString(),
          podId: 'pod-b',
        },
        {
          id: `hist-${dateStr}-${studentId}-2`,
          studentId,
          type: 'shuttle_board',
          timestamp: boardTime.toISOString(),
          shuttleId: 'shuttle-1',
        },
        {
          id: `hist-${dateStr}-${studentId}-3`,
          studentId,
          type: 'school_arrival',
          timestamp: arrivalTime.toISOString(),
        }
      );
    });
  }

  return history;
}

const historicalEvents = generateHistoricalEvents();

export default function HistoryPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | 'all'>('all');

  const dates = Object.keys(historicalEvents).sort((a, b) => b.localeCompare(a));

  const filteredEvents = (dateStr: string) => {
    const dayEvents = historicalEvents[dateStr] || [];
    if (selectedStudent === 'all') return dayEvents;
    return dayEvents.filter(e => e.studentId === selectedStudent);
  };

  // Calculate average arrival time
  const allArrivals = Object.values(historicalEvents)
    .flat()
    .filter(e => e.type === 'school_arrival' && (selectedStudent === 'all' || e.studentId === selectedStudent));

  const avgArrivalMinutes = allArrivals.length > 0
    ? Math.round(
      allArrivals.reduce((sum, e) => {
        const date = new Date(e.timestamp);
        return sum + (date.getHours() * 60 + date.getMinutes());
      }, 0) / allArrivals.length
    )
    : 0;

  const avgArrivalTime = avgArrivalMinutes > 0
    ? `${Math.floor(avgArrivalMinutes / 60)}:${String(avgArrivalMinutes % 60).padStart(2, '0')} AM`
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Check-in History</h1>
        <p className="text-slate-600">View past check-ins and arrival times.</p>
      </div>

      {/* Student Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedStudent === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStudent('all')}
          className={selectedStudent === 'all' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
        >
          All Children
        </Button>
        {currentParent.studentIds.map((sid) => {
          const s = students.find((st) => st.id === sid)!;
          return (
            <Button
              key={sid}
              variant={selectedStudent === sid ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStudent(sid)}
              className={selectedStudent === sid ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {s.name}
            </Button>
          );
        })}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{dates.length}</p>
              <p className="text-sm text-slate-500">Days This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{avgArrivalTime}</p>
              <p className="text-sm text-slate-500">Avg. Arrival</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">100%</p>
              <p className="text-sm text-slate-500">On-Time Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily History */}
      <div className="space-y-4">
        {dates.map((dateStr) => {
          const dayEvents = filteredEvents(dateStr);
          if (dayEvents.length === 0) return null;

          const date = new Date(dateStr);
          const isToday = dateStr === new Date().toISOString().split('T')[0];

          // Group events by student
          const byStudent: Record<string, TrackingEvent[]> = {};
          dayEvents.forEach(e => {
            if (!byStudent[e.studentId]) byStudent[e.studentId] = [];
            byStudent[e.studentId].push(e);
          });

          return (
            <Card key={dateStr} className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </CardTitle>
                  {isToday && (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      Today
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(byStudent).map(([studentId, studentEvents]) => {
                    const student = students.find(s => s.id === studentId)!;
                    const arrivalEvent = studentEvents.find(e => e.type === 'school_arrival');
                    const arrivalTime = arrivalEvent
                      ? new Date(arrivalEvent.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : 'N/A';

                    return (
                      <div
                        key={studentId}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{student.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {studentEvents.map((event, idx) => (
                              <span key={event.id} className="flex items-center text-xs text-slate-500">
                                {idx > 0 && <span className="mx-1">→</span>}
                                {getEventEmoji(event.type)}
                                <span className="ml-1">
                                  {new Date(event.timestamp).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-emerald-600">
                            Arrived {arrivalTime}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {dates.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <p className="text-slate-500">No history available for this week.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getEventEmoji(type: string): string {
  switch (type) {
    case 'pod_checkin':
      return '📍';
    case 'shuttle_board':
      return '🚌';
    case 'school_arrival':
      return '🏫';
    default:
      return '✓';
  }
}
