import type { ReactNode } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />

      <Navbar />

      <PageContainer>
        {children}
      </PageContainer>
    </div>
  )
}

export default DashboardLayout