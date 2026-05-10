import { Suspense } from 'react';
import HistoryContent from './HistoryContent';

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-primary/60">Loading...</p></div>}>
      <HistoryContent />
    </Suspense>
  );
}
