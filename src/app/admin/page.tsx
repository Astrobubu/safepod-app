'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LiveMap3D, ShuttlePosition } from '@/components/shared/LiveMap3D';
import { pods } from '@/data/mock-data';

export default function AdminOperationsPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shuttleData, setShuttleData] = useState<ShuttlePosition[]>([]);
  const [podCounts, setPodCounts] = useState<Record<string, number>>({});
  const [alerts, setAlerts] = useState<{ type: 'warning' | 'info'; message: string }[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lastUpdateRef = useRef(0);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate changing pod counts
  useEffect(() => {
    const updateCounts = () => {
      const counts: Record<string, number> = {};
      pods.forEach(pod => {
        const base = pod.currentCount;
        const variation = Math.floor(Math.random() * 10) - 5;
        counts[pod.id] = Math.max(0, Math.min(pod.capacity, base + variation));
      });
      setPodCounts(counts);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate alerts based on pod counts
  useEffect(() => {
    const newAlerts: { type: 'warning' | 'info'; message: string }[] = [];

    pods.forEach(pod => {
      const count = podCounts[pod.id] ?? pod.currentCount;
      const percentage = count / pod.capacity;

      if (percentage >= 0.95) {
        newAlerts.push({ type: 'warning', message: `${pod.name.split(' - ')[0]} is at capacity (${count}/${pod.capacity})` });
      } else if (percentage >= 0.85) {
        newAlerts.push({ type: 'info', message: `${pod.name.split(' - ')[0]} at ${Math.round(percentage * 100)}% capacity` });
      }
    });

    setAlerts(newAlerts);
  }, [podCounts]);

  // Throttled shuttle update handler
  const handleShuttleUpdate = (shuttles: ShuttlePosition[]) => {
    const now = Date.now();
    // Only update state every 500ms to avoid excessive re-renders
    if (now - lastUpdateRef.current > 500) {
      lastUpdateRef.current = now;
      setShuttleData([...shuttles]);
    }
  };

  // Calculate totals
  const totalStudents = Object.values(podCounts).reduce((sum, count) => sum + count, 0) ||
    pods.reduce((sum, p) => sum + p.currentCount, 0);
  const activeShuttles = shuttleData.filter(s => s.status === 'to_school' || s.status === 'to_pod').length || 5;
  const studentsOnShuttles = shuttleData.reduce((sum, s) => sum + s.studentsOnBoard, 0);

  return (
    <div className="flex h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)]">
      {/* Main Map Area */}
      <div className="flex-1 relative">
        <LiveMap3D
          className="w-full h-full"
          onShuttleUpdate={handleShuttleUpdate}
        />

        {/* Floating Stats - Responsive */}
        <div className="absolute top-4 left-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Card className="shadow-lg border-0 bg-black/80 backdrop-blur-sm text-white">
            <CardContent className="py-2 px-3 sm:py-3 sm:px-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{totalStudents}</p>
                  <p className="text-[10px] sm:text-xs text-white/70">At Pods</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-black/80 backdrop-blur-sm text-white">
            <CardContent className="py-2 px-3 sm:py-3 sm:px-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{activeShuttles}</p>
                  <p className="text-[10px] sm:text-xs text-white/70">Shuttles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hidden sm:block shadow-lg border-0 bg-black/80 backdrop-blur-sm text-white">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">{studentsOnShuttles}</p>
                  <p className="text-xs text-white/70">On Shuttles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time display */}
        <div className="absolute top-4 right-4">
          <Card className="shadow-lg border-0 bg-black/80 backdrop-blur-sm text-white">
            <CardContent className="py-1.5 px-3 sm:py-2 sm:px-4">
              <p className="text-base sm:text-xl font-mono font-semibold">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile sidebar toggle button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden absolute bottom-4 right-4 z-10 bg-slate-900 text-white p-3 rounded-full shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Legend - Hidden on mobile */}
        <div className="hidden sm:block absolute bottom-4 left-4">
          <Card className="shadow-lg border-0 bg-black/80 backdrop-blur-sm text-white">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-white/70">Pods</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-white/70">School</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-white/70">Shuttles</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 right-0 z-50
        w-80 border-l bg-slate-900 overflow-y-auto text-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-slate-700">
          <span className="font-semibold">Dashboard</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Alerts */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Live Alerts ({alerts.length})
          </h2>
          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg text-sm ${
                    alert.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-200 border border-blue-500/30'
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">All systems normal</p>
          )}
        </div>

        {/* Pod Status */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold mb-3">Pod Status</h2>
          <div className="space-y-3">
            {pods.map((pod) => {
              const count = podCounts[pod.id] ?? pod.currentCount;
              const percentage = Math.round((count / pod.capacity) * 100);
              const statusColor = percentage >= 95
                ? 'bg-red-500'
                : percentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

              return (
                <div key={pod.id} className="p-3 rounded-lg bg-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      {pod.name.split(' - ')[0]}
                    </span>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {count}/{pod.capacity}
                    </Badge>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${statusColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shuttle Status */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold mb-3">Active Shuttles</h2>
          <div className="space-y-2">
            {shuttleData.length > 0 ? shuttleData.map((shuttle) => {
              const statusLabel = shuttle.status === 'to_school' ? 'To School' :
                shuttle.status === 'to_pod' ? 'To Pod' :
                shuttle.status === 'at_school' ? 'At School' : 'At Pod';

              const statusColor = shuttle.status === 'to_school'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : shuttle.status === 'to_pod'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30';

              return (
                <div key={shuttle.id} className="p-3 rounded-lg bg-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{shuttle.name}</p>
                    <p className="text-xs text-slate-400">
                      {shuttle.studentsOnBoard} students • {Math.round(shuttle.progress * 100)}%
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-xs border ${statusColor}`}>
                    {statusLabel}
                  </Badge>
                </div>
              );
            }) : (
              // Show placeholder shuttles
              [1, 2, 3, 4, 5].map((i) => (
                <div key={`placeholder-${i}`} className="p-3 rounded-lg bg-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Shuttle {i}</p>
                    <p className="text-xs text-slate-400">Loading...</p>
                  </div>
                  <Badge variant="outline" className="text-xs border bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Active
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Stats */}
        <div className="p-4">
          <h2 className="font-semibold mb-3">System Stats</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Capacity</span>
              <span className="font-medium">{pods.reduce((sum, p) => sum + p.capacity, 0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Utilization</span>
              <span className="font-medium text-emerald-400">
                {Math.round((totalStudents / pods.reduce((sum, p) => sum + p.capacity, 0)) * 100)}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Students Moved</span>
              <span className="font-medium">{Math.floor(studentsOnShuttles * 12)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Avg Wait Time</span>
              <span className="font-medium text-emerald-400">3.8 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
