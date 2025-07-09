// src/app/timestable/page.tsx
'use client'

import TimesTable from '../../components/TimesTable'

export default function TimesTablePage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-start justify-center pt-8">
      {/* Render only the grid; header and nav live on the home page */}
      <TimesTable />
    </div>
  )
}
