import { useState } from 'react'
import { 
  LayoutDashboard, 
  Search, 
  Building2, 
  Users, 
  BarChart3,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'search', name: 'Lead Search', icon: Search },
  { id: 'companies', name: 'Companies', icon: Building2 },
  { id: 'contacts', name: 'Contacts', icon: Users },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-50 border-r h-full">
      <div className="p-6">
        <Button 
          className="w-full mb-6"
          onClick={() => onTabChange('search')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Search
        </Button>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                activeTab === item.id && 'bg-blue-600 text-white'
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>

        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm"
              onClick={() => onTabChange('search')}
            >
              <Plus className="mr-2 h-3 w-3" />
              New Search
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm"
              onClick={() => onTabChange('companies')}
            >
              <Building2 className="mr-2 h-3 w-3" />
              View Companies
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm"
              onClick={() => onTabChange('contacts')}
            >
              <Users className="mr-2 h-3 w-3" />
              Manage Contacts
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}