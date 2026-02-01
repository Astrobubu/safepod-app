'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PodMap } from '@/components/shared/PodMap';
import {
  currentParent,
  students,
  getPodById,
  getSupervisorById,
} from '@/data/mock-data';

export default function MyPodPage() {
  // Get the first student's assigned pod (assuming same pod for siblings)
  const student = students.find((s) => s.id === currentParent.studentIds[0])!;
  const pod = getPodById(student.assignedPod)!;
  const supervisor = getSupervisorById(pod.supervisorId)!;

  const statusColor = pod.status === 'full'
    ? 'bg-red-100 text-red-700 border-red-200'
    : pod.status === 'busy'
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : 'bg-emerald-100 text-emerald-700 border-emerald-200';

  const statusLabel = pod.status === 'full'
    ? 'At Capacity'
    : pod.status === 'busy'
      ? 'Busy'
      : 'Available';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Assigned Pod</h1>
        <p className="text-slate-600">Drop off your children at this location each morning.</p>
      </div>

      {/* Pod Info Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl">{pod.name}</CardTitle>
                <CardDescription>{pod.address}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className={statusColor}>
              {statusLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Map */}
          <div className="rounded-xl overflow-hidden">
            <PodMap
              highlightPod={pod.id}
              showAllPods={false}
              showSchool={true}
              className="w-full h-[300px]"
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">Operating Hours</p>
              <p className="font-semibold text-slate-900">{pod.operatingHours}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-sm text-slate-500">Current Capacity</p>
              <p className="font-semibold text-slate-900">
                {pod.currentCount} / {pod.capacity} students
              </p>
            </div>
          </div>

          {/* Directions Button */}
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${pod.location[1]},${pod.location[0]}`,
                '_blank'
              );
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            Get Directions
          </Button>
        </CardContent>
      </Card>

      {/* Supervisor Contact */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Pod Supervisor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
              {supervisor.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{supervisor.name}</p>
              <p className="text-sm text-slate-500">{supervisor.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${supervisor.phone}`, '_self')}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-0 shadow-lg bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Drop-off Tips</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• Arrive between 7:00 AM - 8:00 AM for the smoothest experience</li>
                <li>• Pull into the designated drop-off lane</li>
                <li>• A supervisor will scan your child's ID card</li>
                <li>• You'll receive a notification when they board the shuttle</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
