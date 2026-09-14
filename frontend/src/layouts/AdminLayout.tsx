import type { ReactNode } from 'react'

import AdminSidebar from '../components/layout/AdminSidebar'

interface AdminLayoutProps {
  children: ReactNode
}

function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">

      <AdminSidebar />

      <main className="min-h-screen pl-64">

        {children}

      </main>

    </div>
  )
}

export default AdminLayout