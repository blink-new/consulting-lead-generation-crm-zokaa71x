export interface Company {
  id: string
  name: string
  industry: string
  size: string
  location: string
  website?: string
  description?: string
  logo?: string
  createdAt: string
  userId: string
}

export interface JobListing {
  id: string
  companyId: string
  title: string
  department: string
  location: string
  platform: 'linkedin' | 'computrabajo' | 'bumeran' | 'zonajobs'
  url: string
  postedDate: string
  description?: string
  requirements?: string
  createdAt: string
  userId: string
}

export interface Contact {
  id: string
  companyId: string
  name: string
  title: string
  email?: string
  linkedin?: string
  phone?: string
  department: string
  isDecisionMaker: boolean
  notes?: string
  lastContactDate?: string
  createdAt: string
  userId: string
}

export interface Lead {
  id: string
  companyId: string
  contactId?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  priority: 'low' | 'medium' | 'high'
  source: string
  estimatedValue?: number
  notes?: string
  nextFollowUp?: string
  pitchSent?: boolean
  pitchDate?: string
  responseReceived?: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export interface SearchFilter {
  platforms: string[]
  industries: string[]
  companySizes: string[]
  locations: string[]
  keywords: string
  dateRange: {
    from: string
    to: string
  }
}