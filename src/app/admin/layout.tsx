import { Navigation } from '@/components/shared/Navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation role="admin" />
      <main>
        {children}
      </main>
    </div>
  );
}
