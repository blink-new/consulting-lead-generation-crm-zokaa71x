import { useState } from 'react'
import { TrendingUp, TrendingDown, Users, Building2, Target, Calendar, Download, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Mock analytics data
const analyticsData = {
  overview: {
    totalLeads: 156,
    totalCompanies: 42,
    totalContacts: 89,
    conversionRate: 12.8,
    trends: {
      leads: 23,
      companies: 8,
      contacts: 15,
      conversion: -2.1
    }
  },
  leadsByStatus: [
    { status: 'New', count: 45, percentage: 28.8, color: 'bg-blue-500' },
    { status: 'Contacted', count: 38, percentage: 24.4, color: 'bg-yellow-500' },
    { status: 'Qualified', count: 32, percentage: 20.5, color: 'bg-green-500' },
    { status: 'Proposal', count: 21, percentage: 13.5, color: 'bg-purple-500' },
    { status: 'Won', count: 12, percentage: 7.7, color: 'bg-emerald-500' },
    { status: 'Lost', count: 8, percentage: 5.1, color: 'bg-red-500' }
  ],
  platformPerformance: [
    { platform: 'LinkedIn', leads: 68, companies: 24, conversion: 15.2, color: 'bg-blue-600' },
    { platform: 'Computrabajo', leads: 42, companies: 18, conversion: 11.9, color: 'bg-green-600' },
    { platform: 'Bumeran', leads: 28, companies: 12, conversion: 10.7, color: 'bg-orange-600' },
    { platform: 'ZonaJobs', leads: 18, companies: 8, conversion: 8.3, color: 'bg-purple-600' }
  ],
  industryBreakdown: [
    { industry: 'Technology', count: 45, percentage: 28.8 },
    { industry: 'Finance', count: 32, percentage: 20.5 },
    { industry: 'Healthcare', count: 28, percentage: 17.9 },
    { industry: 'Manufacturing', count: 24, percentage: 15.4 },
    { industry: 'Retail', count: 18, percentage: 11.5 },
    { industry: 'Other', count: 9, percentage: 5.8 }
  ],
  monthlyTrends: [
    { month: 'Jan', leads: 32, companies: 12, contacts: 18 },
    { month: 'Feb', leads: 45, companies: 16, contacts: 24 },
    { month: 'Mar', leads: 38, companies: 14, contacts: 21 },
    { month: 'Apr', leads: 52, companies: 19, contacts: 28 },
    { month: 'May', leads: 61, companies: 22, contacts: 34 },
    { month: 'Jun', leads: 68, companies: 25, contacts: 38 }
  ],
  topCompanies: [
    { name: 'TechCorp Solutions', leads: 8, contacts: 4, status: 'Qualified' },
    { name: 'FinanceFlow Inc', leads: 6, contacts: 3, status: 'Proposal' },
    { name: 'HealthTech Innovations', leads: 5, contacts: 2, status: 'Contacted' },
    { name: 'ManufacturingPro', leads: 4, contacts: 2, status: 'New' },
    { name: 'RetailMax Corp', leads: 3, contacts: 1, status: 'Qualified' }
  ]
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState('6months')
  const [selectedMetric, setSelectedMetric] = useState('leads')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800'
      case 'Contacted': return 'bg-yellow-100 text-yellow-800'
      case 'Qualified': return 'bg-green-100 text-green-800'
      case 'Proposal': return 'bg-purple-100 text-purple-800'
      case 'Won': return 'bg-emerald-100 text-emerald-800'
      case 'Lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTrend = (value: number) => {
    const isPositive = value > 0
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        <span className="text-sm font-medium">{Math.abs(value)}%</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-gray-600">Track your lead generation performance and identify opportunities</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalLeads}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              {formatTrend(analyticsData.overview.trends.leads)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalCompanies}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              {formatTrend(analyticsData.overview.trends.companies)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contacts</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalContacts}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              {formatTrend(analyticsData.overview.trends.contacts)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              {formatTrend(analyticsData.overview.trends.conversion)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
          <TabsTrigger value="platforms">Platform Performance</TabsTrigger>
          <TabsTrigger value="industries">Industry Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Trends & Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lead Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.leadsByStatus.map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.status}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{item.count}</span>
                          <span className="text-xs text-gray-500">({item.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topCompanies.map((company, index) => (
                    <div key={company.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{company.name}</p>
                          <p className="text-xs text-gray-600">{company.leads} leads • {company.contacts} contacts</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(company.status)}>
                        {company.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analyticsData.platformPerformance.map((platform) => (
                  <div key={platform.platform} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                      <h4 className="font-medium">{platform.platform}</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Leads</span>
                        <span className="font-medium">{platform.leads}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Companies</span>
                        <span className="font-medium">{platform.companies}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Conversion</span>
                        <span className="font-medium">{platform.conversion}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.platformPerformance.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                        <span className="font-medium">{platform.platform}</span>
                      </div>
                      <span className="text-sm text-gray-600">{platform.conversion}% conversion</span>
                    </div>
                    <Progress value={platform.conversion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {analyticsData.industryBreakdown.map((industry) => (
                    <div key={industry.industry} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{industry.industry}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{industry.count}</span>
                          <span className="text-xs text-gray-500">({industry.percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={industry.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto mb-4 relative">
                      {/* Simple pie chart representation */}
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 via-purple-500 via-red-500 to-gray-500"></div>
                      <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{analyticsData.industryBreakdown.reduce((sum, item) => sum + item.count, 0)}</p>
                          <p className="text-sm text-gray-600">Total Leads</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Industry distribution across all leads</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={selectedMetric === 'leads' ? 'default' : 'outline'}
                    onClick={() => setSelectedMetric('leads')}
                    size="sm"
                  >
                    Leads
                  </Button>
                  <Button
                    variant={selectedMetric === 'companies' ? 'default' : 'outline'}
                    onClick={() => setSelectedMetric('companies')}
                    size="sm"
                  >
                    Companies
                  </Button>
                  <Button
                    variant={selectedMetric === 'contacts' ? 'default' : 'outline'}
                    onClick={() => setSelectedMetric('contacts')}
                    size="sm"
                  >
                    Contacts
                  </Button>
                </div>

                <div className="h-64 flex items-end justify-between space-x-2">
                  {analyticsData.monthlyTrends.map((month) => {
                    const value = month[selectedMetric as keyof typeof month] as number
                    const maxValue = Math.max(...analyticsData.monthlyTrends.map(m => m[selectedMetric as keyof typeof m] as number))
                    const height = (value / maxValue) * 100
                    
                    return (
                      <div key={month.month} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '200px' }}>
                          <div 
                            className="w-full bg-blue-500 rounded-t-lg absolute bottom-0 transition-all duration-300"
                            style={{ height: `${height}%` }}
                          />
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                            {value}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{month.month}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Growth Rate</h4>
                  <p className="text-2xl font-bold text-green-600">+23%</p>
                  <p className="text-sm text-gray-600">vs last period</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Avg. Monthly Leads</h4>
                  <p className="text-2xl font-bold">49</p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h4 className="font-medium mb-2">Forecast Next Month</h4>
                  <p className="text-2xl font-bold text-blue-600">75</p>
                  <p className="text-sm text-gray-600">projected leads</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}