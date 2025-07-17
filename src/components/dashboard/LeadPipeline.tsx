import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function LeadPipeline() {
  const pipelineStages = [
    { name: 'New Leads', count: 24, color: 'bg-blue-500' },
    { name: 'Contacted', count: 18, color: 'bg-yellow-500' },
    { name: 'Qualified', count: 12, color: 'bg-orange-500' },
    { name: 'Proposal', count: 8, color: 'bg-purple-500' },
    { name: 'Won', count: 5, color: 'bg-green-500' },
  ]

  const totalLeads = pipelineStages.reduce((sum, stage) => sum + stage.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pipelineStages.map((stage) => (
            <div key={stage.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{stage.name}</span>
                <span className="text-sm text-gray-500">{stage.count} leads</span>
              </div>
              <Progress 
                value={(stage.count / totalLeads) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Pipeline Value</span>
            <span className="text-lg font-bold text-green-600">$247,500</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">Conversion Rate</span>
            <span className="text-sm font-medium">12.5%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}