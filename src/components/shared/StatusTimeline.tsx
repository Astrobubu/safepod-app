'use client';

import { cn } from '@/lib/utils';

type Stage = 'pod' | 'shuttle' | 'school';

interface StatusTimelineProps {
  currentStage: Stage;
  podName?: string;
  shuttleName?: string;
  shuttleProgress?: number; // 0 to 1, for showing progress between pod and school
  className?: string;
}

export function StatusTimeline({
  currentStage,
  podName = 'Pod B',
  shuttleName = 'Shuttle 1',
  shuttleProgress = 0.5,
  className
}: StatusTimelineProps) {
  const isAtPod = currentStage === 'pod';
  const isOnShuttle = currentStage === 'shuttle';
  const isAtSchool = currentStage === 'school';

  const podCompleted = isOnShuttle || isAtSchool;
  const schoolCompleted = isAtSchool;

  return (
    <div className={cn('relative py-2', className)}>
      {/* Main timeline container - horizontal layout like delivery apps */}
      <div className="flex items-center justify-between">
        {/* Pod B circle */}
        <div className="flex flex-col items-center z-10">
          <div
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
              podCompleted || isAtPod
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-400'
            )}
          >
            {podCompleted ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            )}
          </div>
          <span className={cn(
            'mt-2 text-sm font-semibold',
            podCompleted || isAtPod ? 'text-emerald-600' : 'text-slate-400'
          )}>
            {podName}
          </span>
        </div>

        {/* Progress line with shuttle icon in the middle */}
        <div className="flex-1 mx-4 relative">
          {/* Background line */}
          <div className="h-1.5 bg-slate-200 rounded-full" />

          {/* Progress line (green portion) */}
          <div
            className="absolute top-0 left-0 h-1.5 bg-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: isAtSchool ? '100%' : isOnShuttle ? `${shuttleProgress * 100}%` : '0%'
            }}
          />

          {/* Shuttle icon moving along the line */}
          {isOnShuttle && (
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `calc(${shuttleProgress * 100}% - 20px)` }}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg border-2 border-white animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div className="text-center mt-1">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {shuttleName}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* School circle */}
        <div className="flex flex-col items-center z-10">
          <div
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
              schoolCompleted
                ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                : 'bg-slate-100 text-slate-400'
            )}
          >
            {schoolCompleted ? (
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            )}
          </div>
          <span className={cn(
            'mt-2 text-sm font-semibold',
            schoolCompleted ? 'text-emerald-600' : 'text-slate-400'
          )}>
            School
          </span>
        </div>
      </div>
    </div>
  );
}

// Helper to convert location string to Stage
export function locationToStage(location: string): Stage {
  switch (location) {
    case 'home':
    case 'en_route_to_pod':
    case 'at_pod':
      return 'pod';
    case 'on_shuttle':
      return 'shuttle';
    case 'at_school':
    case 'picked_up':
      return 'school';
    default:
      return 'pod';
  }
}
