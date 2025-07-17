import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'lead_created',
      company: 'TechCorp Solutions',
      contact: 'Sarah Johnson',
      action: 'New lead created',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      priority: 'high'
    },
    {
      id: 2,
      type: 'contact_added',
      company: 'Digital Innovations',
      contact: 'Mike Chen',
      action: 'Contact added',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      priority: 'medium'
    },
    {
      id: 3,
      type: 'proposal_sent',
      company: 'StartupXYZ',
      contact: 'Emma Davis',
      action: 'Proposal sent',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      priority: 'high'
    },
    {
      id: 4,
      type: 'meeting_scheduled',
      company: 'Enterprise Corp',
      contact: 'John Smith',
      action: 'Meeting scheduled',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      priority: 'medium'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {activity.contact.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500">
                  {activity.company} • {activity.contact}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(activity.priority)}>
                  {activity.priority}
                </Badge>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}