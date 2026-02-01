'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { pods, shuttles, supervisors } from '@/data/mock-data';

export default function AdminManagePage() {
  const [activeTab, setActiveTab] = useState('pods');

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">System Management</h1>
            <p className="text-slate-600">Manage pods, shuttles, and supervisors.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="pods">Pods ({pods.length})</TabsTrigger>
            <TabsTrigger value="shuttles">Shuttles ({shuttles.length})</TabsTrigger>
            <TabsTrigger value="supervisors">Supervisors ({supervisors.length})</TabsTrigger>
          </TabsList>

          {/* Pods Tab */}
          <TabsContent value="pods" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Pod Name</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Capacity</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Hours</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pods.map((pod) => (
                      <tr key={pod.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-900">{pod.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-600">{pod.address}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-900">{pod.capacity} students</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-slate-600">{pod.operatingHours}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className={
                              pod.status === 'full'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : pod.status === 'busy'
                                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                                  : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            }
                          >
                            {pod.status === 'full' ? 'Full' : pod.status === 'busy' ? 'Busy' : 'Active'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast.info('Edit pod', { description: `Editing ${pod.name}` })}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => toast.error('Cannot delete', { description: 'Pods with assigned students cannot be deleted.' })}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shuttles Tab */}
          <TabsContent value="shuttles" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Shuttle</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Capacity</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Current Load</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Destination</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shuttles.map((shuttle) => {
                      const statusLabel = {
                        en_route_to_pod: 'To Pod',
                        loading: 'Loading',
                        en_route_to_school: 'To School',
                        at_school: 'At School',
                        idle: 'Idle',
                      }[shuttle.status];

                      const statusColor = {
                        en_route_to_pod: 'bg-blue-100 text-blue-700 border-blue-200',
                        loading: 'bg-amber-100 text-amber-700 border-amber-200',
                        en_route_to_school: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                        at_school: 'bg-green-100 text-green-700 border-green-200',
                        idle: 'bg-slate-100 text-slate-700 border-slate-200',
                      }[shuttle.status];

                      return (
                        <tr key={shuttle.id} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-900">{shuttle.name}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-900">{shuttle.capacity} seats</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-600">{shuttle.currentStudents.length} students</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-slate-600">
                              {shuttle.destination}
                              {shuttle.eta ? ` (${shuttle.eta} min)` : ''}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={statusColor}>
                              {statusLabel}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.info('Track shuttle', { description: `Tracking ${shuttle.name}` })}
                              >
                                Track
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.info('Edit shuttle', { description: `Editing ${shuttle.name}` })}
                              >
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supervisors Tab */}
          <TabsContent value="supervisors" className="mt-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Assigned Pod</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supervisors.map((supervisor) => {
                      const pod = pods.find(p => p.id === supervisor.assignedPod);
                      return (
                        <tr key={supervisor.id} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                {supervisor.name.charAt(0)}
                              </div>
                              <div className="font-medium text-slate-900">{supervisor.name}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-600">{supervisor.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-600">{supervisor.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-slate-100">
                              {pod?.name.split(' - ')[0]}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.info('Edit supervisor', { description: `Editing ${supervisor.name}` })}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.info('Reassign', { description: `Reassigning ${supervisor.name}` })}
                              >
                                Reassign
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
