import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, Target, TrendingUp } from 'lucide-react'
import { useCRMData } from '@/hooks/useCRMData'

export function StatsCards() {
  const { companies, contacts, leads, jobListings } = useCRMData()

  const activeLeads = leads.filter(l => ['new', 'contacted', 'qualified'].includes(l.status))
  const decisionMakers = contacts.filter(c => c.isDecisionMaker)
  const companiesWithJobs = companies.filter(c => jobListings.some(j => j.companyId === c.id))
  const recentContacts = contacts.filter(c => 
    c.lastContactDate && 
    new Date(c.lastContactDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  )

  const stats = [
    {
      title: 'Total Companies',
      value: companies.length.toString(),
      change: companiesWithJobs.length > 0 ? `${companiesWithJobs.length} with open jobs` : 'No active jobs',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'Active Leads',
      value: activeLeads.length.toString(),
      change: leads.length > activeLeads.length ? `${leads.length - activeLeads.length} closed` : 'All active',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Decision Makers',
      value: decisionMakers.length.toString(),
      change: `${Math.round((decisionMakers.length / Math.max(contacts.length, 1)) * 100)}% of contacts`,
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Recent Activity',
      value: recentContacts.length.toString(),
      change: 'Contacts this week',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}