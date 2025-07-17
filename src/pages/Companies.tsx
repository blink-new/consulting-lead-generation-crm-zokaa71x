import { useState } from 'react'
import { Search, Filter, Building2, MapPin, Users, ExternalLink, Mail, Phone, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { AddCompanyDialog } from '@/components/dialogs/AddCompanyDialog'
import { useCRMData } from '@/hooks/useCRMData'
import { useToast } from '@/hooks/use-toast'

export function Companies() {
  const { 
    companies, 
    addCompany, 
    deleteCompany, 
    getCompanyContacts, 
    getCompanyJobs,
    addLead
  } = useCRMData()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const { toast } = useToast()

  const industries = ['all', 'Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Consulting']

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry
    return matchesSearch && matchesIndustry
  })

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-blue-600'
      case 'computrabajo': return 'bg-green-600'
      case 'bumeran': return 'bg-orange-600'
      case 'zonajobs': return 'bg-purple-600'
      default: return 'bg-gray-600'
    }
  }

  const handleAddToPipeline = (companyId: string) => {
    const company = companies.find(c => c.id === companyId)
    if (company) {
      addLead({
        companyId,
        status: 'new',
        priority: 'medium',
        source: 'company_database',
        notes: `Lead created from company: ${company.name}`
      })
      
      toast({
        title: "Success",
        description: `${company.name} added to pipeline`
      })
    }
  }

  const handleDeleteCompany = (companyId: string, companyName: string) => {
    deleteCompany(companyId)
    toast({
      title: "Company Deleted",
      description: `${companyName} has been removed from your database`
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Company Database</h2>
          <p className="text-gray-600">Manage discovered companies and their hiring information</p>
        </div>
        <AddCompanyDialog onAddCompany={addCompany} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Contacts</p>
                <p className="text-2xl font-bold">
                  {companies.filter(c => getCompanyContacts(c.id).length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ExternalLink className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Open Jobs</p>
                <p className="text-2xl font-bold">
                  {companies.filter(c => getCompanyJobs(c.id).length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Filter className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Industries</p>
                <p className="text-2xl font-bold">
                  {new Set(companies.map(c => c.industry).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search companies, industries, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {industries.map((industry) => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedIndustry(industry)}
                  className="capitalize"
                >
                  {industry}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => {
          const jobListings = getCompanyJobs(company.id)
          const contacts = getCompanyContacts(company.id)
          
          return (
            <Dialog key={company.id}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={company.logo} alt={company.name} />
                        <AvatarFallback>
                          <Building2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {company.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          {company.size}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddToPipeline(company.id)}>
                          Add to Pipeline
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteCompany(company.id, company.name)}
                        >
                          Delete Company
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Open Positions</span>
                      <Badge variant="secondary">{jobListings.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Contacts</span>
                      <Badge variant="secondary">{contacts.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Decision Makers</span>
                      <Badge variant="secondary">
                        {contacts.filter(c => c.isDecisionMaker).length}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {jobListings.slice(0, 3).map((job, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${getPlatformColor(job.platform)}`}
                          title={job.platform}
                        />
                      ))}
                    </div>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                  </div>
                </CardContent>
              </Card>

              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={company.logo} alt={company.name} />
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span>{company.name}</span>
                        {company.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-normal">{company.industry} • {company.size}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs ({jobListings.length})</TabsTrigger>
                    <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Company Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {company.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                            {company.size}
                          </div>
                          {company.website && (
                            <div className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                Website
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Quick Stats</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Open Positions:</span>
                            <Badge variant="secondary">{jobListings.length}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Key Contacts:</span>
                            <Badge variant="secondary">{contacts.filter(c => c.isDecisionMaker).length}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Added:</span>
                            <span>{new Date(company.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {company.description && (
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-sm text-gray-600">{company.description}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <Button onClick={() => handleAddToPipeline(company.id)} className="w-full">
                        Add to Sales Pipeline
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="jobs" className="space-y-4">
                    {jobListings.length > 0 ? (
                      jobListings.map((job) => (
                        <Card key={job.id}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium">{job.title}</h4>
                                <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                                <p className="text-xs text-gray-500 mt-1">Posted {new Date(job.postedDate).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="capitalize">
                                  {job.platform}
                                </Badge>
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No job listings found for this company.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="contacts" className="space-y-4">
                    {contacts.length > 0 ? (
                      contacts.map((contact) => (
                        <Card key={contact.id}>
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium">{contact.name}</h4>
                                  {contact.isDecisionMaker && (
                                    <Badge variant="default" className="text-xs">Key Contact</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{contact.title} • {contact.department}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  {contact.email && (
                                    <a href={`mailto:${contact.email}`} className="flex items-center text-sm text-blue-600 hover:underline">
                                      <Mail className="h-3 w-3 mr-1" />
                                      Email
                                    </a>
                                  )}
                                  {contact.linkedin && (
                                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      LinkedIn
                                    </a>
                                  )}
                                  {contact.phone && (
                                    <a href={`tel:${contact.phone}`} className="flex items-center text-sm text-blue-600 hover:underline">
                                      <Phone className="h-3 w-3 mr-1" />
                                      Call
                                    </a>
                                  )}
                                </div>
                                {contact.notes && (
                                  <p className="text-xs text-gray-500 mt-2">{contact.notes}</p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No contacts found for this company.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add new companies to your database.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}