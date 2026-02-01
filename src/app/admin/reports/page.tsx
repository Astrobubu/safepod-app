'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { pods, weeklyStats } from '@/data/mock-data';

export default function AdminReportsPage() {
  const todayStats = weeklyStats[0];
  const yesterdayStats = weeklyStats[1];

  // Calculate week totals
  const weekTotals = weeklyStats.reduce(
    (acc, day) => ({
      students: acc.students + day.totalStudents,
      onTime: acc.onTime + day.onTimeArrivals,
      late: acc.late + day.lateArrivals,
      avgWait: acc.avgWait + day.avgWaitTime,
    }),
    { students: 0, onTime: 0, late: 0, avgWait: 0 }
  );

  const weekAvgWait = (weekTotals.avgWait / weeklyStats.length).toFixed(1);
  const onTimeRate = Math.round((weekTotals.onTime / weekTotals.students) * 100);

  // Comparison with yesterday
  const studentChange = todayStats.totalStudents - yesterdayStats.totalStudents;
  const waitTimeChange = todayStats.avgWaitTime - yesterdayStats.avgWaitTime;

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600">Track performance metrics and identify trends.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Today's Students</p>
                  <p className="text-3xl font-bold text-slate-900">{todayStats.totalStudents}</p>
                  <p className={`text-sm ${studentChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {studentChange >= 0 ? '+' : ''}{studentChange} vs yesterday
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">On-Time Rate</p>
                  <p className="text-3xl font-bold text-emerald-600">{onTimeRate}%</p>
                  <p className="text-sm text-slate-500">Week average</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-slate-900">{todayStats.avgWaitTime} min</p>
                  <p className={`text-sm ${waitTimeChange <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {waitTimeChange <= 0 ? '' : '+'}{waitTimeChange.toFixed(1)} min vs yesterday
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Peak Hour</p>
                  <p className="text-3xl font-bold text-slate-900">{todayStats.peakHour}</p>
                  <p className="text-sm text-slate-500">Busiest time</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Daily Throughput */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Daily Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyStats.slice().reverse().map((day, idx) => {
                  const maxStudents = Math.max(...weeklyStats.map(d => d.totalStudents));
                  const percentage = (day.totalStudents / maxStudents) * 100;
                  const date = new Date(day.date);

                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 w-10">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                          {day.totalStudents} students
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Wait Time by Pod */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Avg Wait Time by Pod</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayStats.podStats.map((stat) => {
                  const pod = pods.find(p => p.id === stat.podId);
                  const maxWait = Math.max(...todayStats.podStats.map(s => s.avgWaitTime));
                  const percentage = (stat.avgWaitTime / maxWait) * 100;

                  const color = stat.avgWaitTime < 4
                    ? 'from-emerald-500 to-teal-500'
                    : stat.avgWaitTime < 5
                      ? 'from-amber-500 to-orange-500'
                      : 'from-red-500 to-rose-500';

                  return (
                    <div key={stat.podId} className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 w-16">
                        {pod?.name.split(' - ')[0]}
                      </span>
                      <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${color} rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                          {stat.avgWaitTime} min
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pod Performance Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Pod Performance - Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Pod</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Throughput</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Avg Wait</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Current</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pods.map((pod) => {
                    const stat = todayStats.podStats.find(s => s.podId === pod.id);
                    const statusBadge = pod.status === 'full'
                      ? <Badge className="bg-red-100 text-red-700">Full</Badge>
                      : pod.status === 'busy'
                        ? <Badge className="bg-amber-100 text-amber-700">Busy</Badge>
                        : <Badge className="bg-emerald-100 text-emerald-700">Normal</Badge>;

                    return (
                      <tr key={pod.id} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium text-slate-900">{pod.name}</td>
                        <td className="py-3 px-4 text-slate-600">{stat?.throughput || 0} students</td>
                        <td className="py-3 px-4 text-slate-600">{stat?.avgWaitTime || 0} min</td>
                        <td className="py-3 px-4 text-slate-600">{pod.currentCount}/{pod.capacity}</td>
                        <td className="py-3 px-4">{statusBadge}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Week Summary */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 mb-4">Week Summary</h3>
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">{weekTotals.students.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">On-Time Arrivals</p>
                <p className="text-2xl font-bold text-emerald-600">{weekTotals.onTime.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Late Arrivals</p>
                <p className="text-2xl font-bold text-amber-600">{weekTotals.late}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Avg Wait Time</p>
                <p className="text-2xl font-bold text-slate-900">{weekAvgWait} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
