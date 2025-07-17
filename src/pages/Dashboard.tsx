import { StatsCards } from '@/components/dashboard/StatsCards'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { LeadPipeline } from '@/components/dashboard/LeadPipeline'
import { useCRMData } from '@/hooks/useCRMData'

export function Dashboard() {
  const { companies, contacts, leads } = useCRMData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Recruitment Consultancy Dashboard</h2>
        <p className="text-gray-600">Track your lead generation progress and client outreach activities.</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <LeadPipeline />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Companies Discovered</h3>
          <p className="text-3xl font-bold mb-2">{companies.length}</p>
          <p className="text-blue-100">Total companies in database</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Decision Makers</h3>
          <p className="text-3xl font-bold mb-2">{contacts.filter(c => c.isDecisionMaker).length}</p>
          <p className="text-green-100">Key contacts identified</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Active Leads</h3>
          <p className="text-3xl font-bold mb-2">{leads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status)).length}</p>
          <p className="text-purple-100">Leads in pipeline</p>
        </div>
      </div>
    </div>
  )
}