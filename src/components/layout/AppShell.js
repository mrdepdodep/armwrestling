'use client';

import TopBar from './TopBar';
import PageHeader from './PageHeader';
import VisitTracker from './VisitTracker';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <VisitTracker />
      <TopBar />
      <main className="app-main">
        <div className="page-wrap">
          <PageHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
