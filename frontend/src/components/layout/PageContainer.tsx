import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
}

function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="ml-64 min-h-screen bg-slate-50 pt-20">
      <div className="p-8">
        {children}
      </div>
    </main>
  )
}

export default PageContainer