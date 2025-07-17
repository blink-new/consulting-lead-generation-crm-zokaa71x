import { useState } from 'react'
import { Search, Filter, Download, Play, Building2, Users, ExternalLink, Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCRMData } from '@/hooks/useCRMData'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'

interface JobListing {
  id: string
  companyName: string
  title: string
  location: string
  platform: string
  url: string
  postedDate: string
  description: string
  requirements?: string
  salaryRange?: string
  employmentType?: string
  companyInfo?: {
    industry?: string
    size?: string
    website?: string
    description?: string
  }
  contacts?: {
    name?: string
    title?: string
    linkedin?: string
    email?: string
  }[]
}

interface SearchResult {
  companyName: string
  jobs: JobListing[]
  totalJobs: number
  companyInfo?: {
    industry?: string
    size?: string
    website?: string
    description?: string
  }
  contacts: {
    name?: string
    title?: string
    linkedin?: string
    email?: string
  }[]
}

export function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const { addCompany, addContact, addJobListing, addLead, saveSearchHistory } = useCRMData()
  const { toast } = useToast()

  const targetCompanies = [
    { id: 'mercadolibre', name: 'Mercado Libre', color: 'bg-yellow-600' },
    { id: 'globant', name: 'Globant', color: 'bg-blue-600' },
    { id: 'despegar', name: 'Despegar', color: 'bg-green-600' },
    { id: 'auth0', name: 'Auth0', color: 'bg-orange-600' },
    { id: 'uala', name: 'Ualá', color: 'bg-purple-600' },
    { id: 'rappi', name: 'Rappi', color: 'bg-pink-600' },
    { id: 'nubank', name: 'Nubank', color: 'bg-indigo-600' },
    { id: 'stone', name: 'Stone', color: 'bg-gray-600' },
  ]

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 
    'Consulting', 'Education', 'Real Estate', 'Media', 'Transportation'
  ]

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-1000 employees', '1000+ employees'
  ]

  const handleSearch = async () => {
    setIsSearching(true)
    setHasSearched(false)
    setSearchError(null)
    
    try {
      // Call the company career page scraping function
      const response = await fetch('https://zokaa71x--real-job-scraper.functions.blink.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companies: selectedCompanies.length > 0 ? selectedCompanies : undefined,
          keywords: searchQuery.trim() || undefined,
          location: location.trim() || undefined,
          industry: selectedIndustries.length > 0 ? selectedIndustries.join(',') : undefined,
          companySize: selectedSizes.length > 0 ? selectedSizes.join(',') : undefined
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Search API Error:', response.status, errorText)
        throw new Error(`Search failed (${response.status}): ${errorText.substring(0, 100)}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.errors?.join(', ') || data.error || 'Search failed')
      }

      // Group jobs by company
      const companiesMap = new Map<string, SearchResult>()
      
      data.jobs.forEach((job: JobListing) => {
        const companyKey = job.companyName.toLowerCase()
        
        if (!companiesMap.has(companyKey)) {
          companiesMap.set(companyKey, {
            companyName: job.companyName,
            jobs: [],
            totalJobs: 0,
            companyInfo: job.companyInfo,
            contacts: job.contacts || []
          })
        }
        
        const company = companiesMap.get(companyKey)!
        company.jobs.push(job)
        company.totalJobs++
      })

      const results = Array.from(companiesMap.values())
      setSearchResults(results)
      setHasSearched(true)

      // Save search history
      await saveSearchHistory({
        query: searchQuery.trim(),
        location: location.trim(),
        platforms: selectedCompanies,
        industries: selectedIndustries,
        companySizes: selectedSizes,
        resultsCount: results.length
      })

      toast({
        title: "Search Complete ✅",
        description: `Found ${results.length} companies with ${data.totalJobs} job postings from ${data.companiesScraped || 'multiple'} company career pages`
      })

    } catch (error) {
      console.error('Search error:', error)
      setSearchError(error instanceof Error ? error.message : 'Search failed')
      toast({
        title: "Search Failed",
        description: "Unable to complete search. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSearching(false)
    }
  }

  const toggleCompany = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    )
  }

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    )
  }

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const handleAddToPipeline = async (result: SearchResult) => {
    try {
      const user = await blink.auth.me()
      
      // Add company
      const newCompany = addCompany({
        name: result.companyName,
        industry: result.companyInfo?.industry || 'Unknown',
        size: result.companyInfo?.size || 'Unknown',
        location: result.jobs[0]?.location || 'Unknown',
        website: result.companyInfo?.website || '',
        description: result.companyInfo?.description || `Company discovered through job platform search with ${result.totalJobs} open positions.`,
        logo: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center`
      })

      // Add contacts
      let primaryContact = null
      if (result.contacts && result.contacts.length > 0) {
        const contact = result.contacts[0]
        primaryContact = addContact({
          companyId: newCompany.id,
          name: contact.name || 'Unknown Contact',
          title: contact.title || 'Hiring Manager',
          email: contact.email || '',
          linkedin: contact.linkedin || '',
          department: 'Hiring',
          isDecisionMaker: true,
          notes: `Contact discovered through job platform search. Responsible for hiring at ${result.companyName}.`
        })
      }

      // Add job listings
      result.jobs.forEach((job) => {
        addJobListing({
          companyId: newCompany.id,
          title: job.title,
          department: 'Various',
          location: job.location,
          platform: job.platform.toLowerCase(),
          url: job.url,
          postedDate: job.postedDate,
          description: job.description
        })
      })

      // Create lead
      addLead({
        companyId: newCompany.id,
        contactId: primaryContact?.id,
        status: 'new',
        priority: result.totalJobs > 3 ? 'high' : 'medium',
        source: 'job_platform_search',
        notes: `Lead generated from company career page search. Company has ${result.totalJobs} active job posting(s). Source: Career page scraping`
      })

      toast({
        title: "Added to Pipeline",
        description: `${result.companyName} with ${result.totalJobs} job(s) added to your CRM`
      })

    } catch (error) {
      console.error('Error adding to pipeline:', error)
      toast({
        title: "Error",
        description: "Failed to add company to pipeline. Please try again.",
        variant: "destructive"
      })
    }
  }

  const exportResults = () => {
    if (searchResults.length === 0) return

    const csvData = searchResults.flatMap(result => 
      result.jobs.map(job => ({
        'Company Name': result.companyName,
        'Job Title': job.title,
        'Location': job.location,
        'Platform': job.platform,
        'Posted Date': job.postedDate,
        'Job URL': job.url,
        'Company Industry': result.companyInfo?.industry || '',
        'Company Size': result.companyInfo?.size || '',
        'Company Website': result.companyInfo?.website || '',
        'Contact Name': result.contacts[0]?.name || '',
        'Contact Title': result.contacts[0]?.title || '',
        'Contact LinkedIn': result.contacts[0]?.linkedin || '',
        'Contact Email': result.contacts[0]?.email || ''
      }))
    )

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smartr-crm-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Lead data exported to CSV file"
    })
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold">Company Career Page Scanner</h2>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              🎯 DIRECT ACCESS
            </Badge>
          </div>
          <p className="text-gray-600">Scan company career pages directly to discover open positions and hiring contacts</p>
          <p className="text-sm text-green-600 font-medium mt-1">✓ Direct career page access • ✓ Real company data • ✓ Contact discovery</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={!hasSearched || searchResults.length === 0} onClick={exportResults}>
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Searching...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search Error */}
      {searchError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {searchError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Companies */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Target Companies</Label>
              <div className="space-y-2">
                {targetCompanies.map((company) => (
                  <div key={company.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={company.id}
                      checked={selectedCompanies.includes(company.id)}
                      onCheckedChange={() => toggleCompany(company.id)}
                    />
                    <Label htmlFor={company.id} className="text-sm">
                      {company.name}
                    </Label>
                    <div className={`w-2 h-2 rounded-full ${company.color}`} />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Leave empty to scan all companies</p>
            </div>

            <Separator />

            {/* Industries */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Industries</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {industries.map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox 
                      id={industry} 
                      checked={selectedIndustries.includes(industry)}
                      onCheckedChange={() => toggleIndustry(industry)}
                    />
                    <Label htmlFor={industry} className="text-sm">
                      {industry}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Company Size */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Company Size</Label>
              <div className="space-y-2">
                {companySizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox 
                      id={size} 
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => toggleSize(size)}
                    />
                    <Label htmlFor={size} className="text-sm">
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search for job titles or keywords (e.g., 'Software Engineer', 'Marketing Manager', 'Data Analyst')..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="relative">
                  <Input
                    placeholder="Location (e.g., 'Buenos Aires', 'São Paulo', 'Remote')..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedCompanies.map((companyId) => {
                  const company = targetCompanies.find(c => c.id === companyId)
                  return company ? (
                    <Badge key={companyId} variant="secondary">
                      {company.name}
                    </Badge>
                  ) : null
                })}
                {selectedIndustries.map((industry) => (
                  <Badge key={industry} variant="outline">
                    {industry}
                  </Badge>
                ))}
                {selectedSizes.map((size) => (
                  <Badge key={size} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {isSearching ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">🔍 SCANNING COMPANY CAREER PAGES</p>
                  <p className="text-sm text-gray-400 mt-2">Accessing company career pages and extracting job data</p>
                  <div className="mt-4 space-y-1 text-xs text-gray-500">
                    <p>• 🌐 Accessing company career pages directly</p>
                    <p>• 📋 Extracting open job positions</p>
                    <p className="text-green-600 font-medium mt-2">• 📊 Analyzing company data and contact information</p>
                    <p className="text-green-600 font-medium">• 🎯 Identifying decision makers and hiring contacts</p>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">
                      <strong>Demo Mode:</strong> This search generates realistic simulated job data for demonstration purposes. Results typically take 3-5 seconds.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : hasSearched ? (
            <div className="space-y-4">
              {/* Search Results Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">🔍 Search Results</h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                          DEMO DATA
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Found {searchResults.length} companies with {searchResults.reduce((sum, r) => sum + r.totalJobs, 0)} job postings
                      </p>
                      <p className="text-xs text-green-600 font-medium">
                        ✓ Career page data • ✓ Company information • ✓ Contact details
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        🎭 Demo Mode
                      </Badge>
                      <Badge variant="outline" className="text-gray-600 border-gray-600">
                        {new Date().toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              {searchResults.map((result, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {result.companyName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-lg">{result.companyName}</h3>
                            <Badge variant="outline" className="text-xs">
                              Demo Data
                            </Badge>
                          </div>
                          <p className="text-gray-600">{result.companyInfo?.industry || 'Unknown Industry'} • {result.companyInfo?.size || 'Unknown Size'}</p>
                          <p className="text-sm text-gray-500">{result.jobs[0]?.location || 'Multiple Locations'}</p>
                          {result.companyInfo?.website && (
                            <a 
                              href={`https://${result.companyInfo.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline flex items-center"
                            >
                              {result.companyInfo.website}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800 mb-2">
                          {result.totalJobs} Open Position{result.totalJobs !== 1 ? 's' : ''}
                        </Badge>
                        {result.contacts && result.contacts.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Key Contact:</span>
                            <br />
                            {result.contacts[0].linkedin ? (
                              <a 
                                href={result.contacts[0].linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {result.contacts[0].name || 'View Profile'}
                              </a>
                            ) : (
                              <span>{result.contacts[0].name || 'Contact Available'}</span>
                            )}
                            <br />
                            <span className="text-xs text-gray-500">{result.contacts[0].title || 'Hiring Manager'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {result.jobs.slice(0, 3).map((job, jobIndex) => (
                        <div key={jobIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">{job.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {job.platform}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{job.postedDate}</span>
                            <a 
                              href={job.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              View Job
                            </a>
                          </div>
                        </div>
                      ))}
                      {result.jobs.length > 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{result.jobs.length - 3} more positions
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          Active Hiring
                        </Badge>
                        {result.totalJobs > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            High Volume
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          Demo Data
                        </Badge>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" onClick={() => handleAddToPipeline(result)}>
                          <Plus className="mr-2 h-3 w-3" />
                          Add to Pipeline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {searchResults.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                      <p className="text-gray-600">Try adjusting your search criteria or keywords.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Company Career Page Scan</h3>
                  <p className="text-gray-600 mb-4">Scan company career pages directly to discover open positions</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• Direct access to company career pages</p>
                    <p>• Real job postings from major Latin American companies</p>
                    <p>• Discover hiring managers and decision makers</p>
                    <p>• Filter by industry, company size, or location</p>
                    <p>• Add promising leads directly to your sales pipeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}