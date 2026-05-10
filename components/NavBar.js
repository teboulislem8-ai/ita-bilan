'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-primary">
          FDPS
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/form" className="text-primary hover:text-primary-light">
            Form
          </Link>
          <Link href="/history" className="text-primary hover:text-primary-light">
            History
          </Link>
          <Link href="/settings" className="text-primary hover:text-primary-light">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  );
}
