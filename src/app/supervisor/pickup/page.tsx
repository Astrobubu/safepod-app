'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  currentSupervisor,
  getPodById,
  students,
} from '@/data/mock-data';

// Mock afternoon pickup data
const pickupQueue = [
  { studentId: 's1', parentArrived: false, notified: true, arrivalTime: null },
  { studentId: 's2', parentArrived: false, notified: true, arrivalTime: null },
  { studentId: 's8', parentArrived: true, notified: true, arrivalTime: '3:15 PM' },
  { studentId: 's3', parentArrived: false, notified: false, arrivalTime: null },
];

export default function PickupQueuePage() {
  const [queue, setQueue] = useState(pickupQueue);

  const pod = getPodById(currentSupervisor.assignedPod)!;

  const handleParentArrived = (studentId: string) => {
    setQueue(prev => prev.map(item =>
      item.studentId === studentId
        ? { ...item, parentArrived: true, arrivalTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) }
        : item
    ));
    const student = students.find(s => s.id === studentId);
    toast.success('Parent arrived', {
      description: `${student?.name}'s parent is here for pickup.`,
    });
  };

  const handlePickupComplete = (studentId: string) => {
    setQueue(prev => prev.filter(item => item.studentId !== studentId));
    const student = students.find(s => s.id === studentId);
    toast.success('Pickup complete', {
      description: `${student?.name} has been picked up.`,
    });
  };

  const handleNotifyParent = (studentId: string) => {
    setQueue(prev => prev.map(item =>
      item.studentId === studentId
        ? { ...item, notified: true }
        : item
    ));
    const student = students.find(s => s.id === studentId);
    toast.info('Parent notified', {
      description: `Sent notification to ${student?.name}'s parent.`,
    });
  };

  const waitingForParent = queue.filter(q => !q.parentArrived);
  const parentArrived = queue.filter(q => q.parentArrived);
  const unclaimed = queue.filter(q => !q.parentArrived && q.notified);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Afternoon Pickup</h1>
          <p className="text-slate-600">{pod.name}</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {queue.length} students
        </Badge>
      </div>

      {/* Alert for unclaimed */}
      {unclaimed.length >= 2 && (
        <Card className="border-0 shadow-lg bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-900">
                  {unclaimed.length} students waiting for pickup
                </p>
                <p className="text-sm text-amber-700">
                  Parents have been notified but haven't arrived yet
                </p>
              </div>
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => toast.info('Sending reminders', { description: 'Reminder notifications sent to all pending parents.' })}
              >
                Send Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parent Arrived - Ready for Pickup */}
      {parentArrived.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              Ready for Pickup ({parentArrived.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parentArrived.map((item) => {
                const student = students.find(s => s.id === item.studentId)!;
                return (
                  <div
                    key={item.studentId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-slate-900">{student.name}</p>
                      <p className="text-sm text-emerald-700">Parent arrived at {item.arrivalTime}</p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handlePickupComplete(item.studentId)}
                    >
                      Complete Pickup
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting for Parent */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Waiting for Parent ({waitingForParent.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {waitingForParent.length > 0 ? (
            <div className="space-y-3">
              {waitingForParent.map((item) => {
                const student = students.find(s => s.id === item.studentId)!;
                return (
                  <div
                    key={item.studentId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-slate-900">{student.name}</p>
                      <p className="text-sm text-slate-500">
                        {student.grade}
                        {item.notified && (
                          <span className="ml-2 text-blue-600">• Parent notified</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!item.notified && (
                        <Button
                          variant="outline"
                          onClick={() => handleNotifyParent(item.studentId)}
                        >
                          Notify Parent
                        </Button>
                      )}
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleParentArrived(item.studentId)}
                      >
                        Parent Arrived
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>All students have been picked up!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-slate-900">{queue.length}</p>
            <p className="text-sm text-slate-500">Total Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-emerald-600">{parentArrived.length}</p>
            <p className="text-sm text-slate-500">Ready to Go</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-600">{waitingForParent.length}</p>
            <p className="text-sm text-slate-500">Awaiting Parent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
