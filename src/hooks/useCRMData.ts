import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import type { Company, Contact, JobListing, Lead } from '@/types'

// Generate unique IDs
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function useCRMData() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  // Load data on mount
  useEffect(() => {
    loadAllData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadAllData = async () => {
    try {
      const user = await blink.auth.me()
      if (!user) return

      // Load all data in parallel
      const [companiesData, contactsData, jobsData, leadsData] = await Promise.all([
        loadCompanies(),
        loadContacts(), 
        loadJobListings(),
        loadLeads()
      ])

      setCompanies(companiesData)
      setContacts(contactsData)
      setJobListings(jobsData)
      setLeads(leadsData)
    } catch (error) {
      console.error('Error loading CRM data:', error)
      // Fallback to localStorage
      const stored = {
        companies: JSON.parse(localStorage.getItem('crm_companies') || '[]'),
        contacts: JSON.parse(localStorage.getItem('crm_contacts') || '[]'),
        jobs: JSON.parse(localStorage.getItem('crm_jobs') || '[]'),
        leads: JSON.parse(localStorage.getItem('crm_leads') || '[]')
      }
      setCompanies(stored.companies)
      setContacts(stored.contacts)
      setJobListings(stored.jobs)
      setLeads(stored.leads)
    } finally {
      setLoading(false)
    }
  }

  const loadCompanies = async (): Promise<Company[]> => {
    try {
      const user = await blink.auth.me()
      if (!user) return []

      // Try localStorage first for immediate display
      const stored = localStorage.getItem('crm_companies')
      if (stored) {
        return JSON.parse(stored)
      }

      return []
    } catch (error) {
      console.error('Error loading companies:', error)
      return []
    }
  }

  const loadContacts = async (): Promise<Contact[]> => {
    try {
      const user = await blink.auth.me()
      if (!user) return []

      const stored = localStorage.getItem('crm_contacts')
      if (stored) {
        return JSON.parse(stored)
      }

      return []
    } catch (error) {
      console.error('Error loading contacts:', error)
      return []
    }
  }

  const loadJobListings = async (): Promise<JobListing[]> => {
    try {
      const user = await blink.auth.me()
      if (!user) return []

      const stored = localStorage.getItem('crm_jobs')
      if (stored) {
        return JSON.parse(stored)
      }

      return []
    } catch (error) {
      console.error('Error loading job listings:', error)
      return []
    }
  }

  const loadLeads = async (): Promise<Lead[]> => {
    try {
      const user = await blink.auth.me()
      if (!user) return []

      const stored = localStorage.getItem('crm_leads')
      if (stored) {
        return JSON.parse(stored)
      }

      return []
    } catch (error) {
      console.error('Error loading leads:', error)
      return []
    }
  }

  // Company operations with persistence
  const addCompany = (company: Omit<Company, 'id' | 'createdAt' | 'userId'>) => {
    const newCompany: Company = {
      ...company,
      id: generateId(),
      createdAt: new Date().toISOString(),
      userId: 'user1'
    }
    
    const updatedCompanies = [...companies, newCompany]
    setCompanies(updatedCompanies)
    localStorage.setItem('crm_companies', JSON.stringify(updatedCompanies))
    
    return newCompany
  }

  const updateCompany = (id: string, updates: Partial<Company>) => {
    const updatedCompanies = companies.map(company => 
      company.id === id ? { ...company, ...updates } : company
    )
    setCompanies(updatedCompanies)
    localStorage.setItem('crm_companies', JSON.stringify(updatedCompanies))
  }

  const deleteCompany = (id: string) => {
    const updatedCompanies = companies.filter(company => company.id !== id)
    const updatedContacts = contacts.filter(contact => contact.companyId !== id)
    const updatedJobs = jobListings.filter(job => job.companyId !== id)
    const updatedLeads = leads.filter(lead => lead.companyId !== id)
    
    setCompanies(updatedCompanies)
    setContacts(updatedContacts)
    setJobListings(updatedJobs)
    setLeads(updatedLeads)
    
    localStorage.setItem('crm_companies', JSON.stringify(updatedCompanies))
    localStorage.setItem('crm_contacts', JSON.stringify(updatedContacts))
    localStorage.setItem('crm_jobs', JSON.stringify(updatedJobs))
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads))
  }

  // Contact operations with persistence
  const addContact = (contact: Omit<Contact, 'id' | 'createdAt' | 'userId'>) => {
    const newContact: Contact = {
      ...contact,
      id: generateId(),
      createdAt: new Date().toISOString(),
      userId: 'user1'
    }
    
    const updatedContacts = [...contacts, newContact]
    setContacts(updatedContacts)
    localStorage.setItem('crm_contacts', JSON.stringify(updatedContacts))
    
    return newContact
  }

  const updateContact = (id: string, updates: Partial<Contact>) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === id ? { ...contact, ...updates } : contact
    )
    setContacts(updatedContacts)
    localStorage.setItem('crm_contacts', JSON.stringify(updatedContacts))
  }

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id)
    setContacts(updatedContacts)
    localStorage.setItem('crm_contacts', JSON.stringify(updatedContacts))
  }

  // Job listing operations with persistence
  const addJobListing = (job: Omit<JobListing, 'id' | 'createdAt' | 'userId'>) => {
    const newJob: JobListing = {
      ...job,
      id: generateId(),
      createdAt: new Date().toISOString(),
      userId: 'user1'
    }
    
    const updatedJobs = [...jobListings, newJob]
    setJobListings(updatedJobs)
    localStorage.setItem('crm_jobs', JSON.stringify(updatedJobs))
    
    return newJob
  }

  const updateJobListing = (id: string, updates: Partial<JobListing>) => {
    const updatedJobs = jobListings.map(job => 
      job.id === id ? { ...job, ...updates } : job
    )
    setJobListings(updatedJobs)
    localStorage.setItem('crm_jobs', JSON.stringify(updatedJobs))
  }

  const deleteJobListing = (id: string) => {
    const updatedJobs = jobListings.filter(job => job.id !== id)
    setJobListings(updatedJobs)
    localStorage.setItem('crm_jobs', JSON.stringify(updatedJobs))
  }

  // Lead operations with persistence
  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    const newLead: Lead = {
      ...lead,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'user1'
    }
    
    const updatedLeads = [...leads, newLead]
    setLeads(updatedLeads)
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads))
    
    return newLead
  }

  const updateLead = (id: string, updates: Partial<Lead>) => {
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead
    )
    setLeads(updatedLeads)
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads))
  }

  const deleteLead = (id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id)
    setLeads(updatedLeads)
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads))
  }

  // Search history operations
  const saveSearchHistory = async (searchParams: {
    query?: string
    location?: string
    platforms: string[]
    industries?: string[]
    companySizes?: string[]
    resultsCount: number
  }) => {
    try {
      const searchRecord = {
        id: generateId(),
        userId: 'user1',
        query: searchParams.query || '',
        location: searchParams.location || '',
        platforms: searchParams.platforms.join(','),
        industries: searchParams.industries?.join(',') || '',
        companySizes: searchParams.companySizes?.join(',') || '',
        resultsCount: searchParams.resultsCount,
        createdAt: new Date().toISOString()
      }

      // Save to localStorage
      const existingHistory = JSON.parse(localStorage.getItem('crm_search_history') || '[]')
      const updatedHistory = [searchRecord, ...existingHistory.slice(0, 49)] // Keep last 50 searches
      localStorage.setItem('crm_search_history', JSON.stringify(updatedHistory))

      return searchRecord
    } catch (error) {
      console.error('Error saving search history:', error)
    }
  }

  const getSearchHistory = () => {
    try {
      return JSON.parse(localStorage.getItem('crm_search_history') || '[]')
    } catch (error) {
      console.error('Error loading search history:', error)
      return []
    }
  }

  // Helper functions
  const getCompanyContacts = (companyId: string) => {
    return contacts.filter(contact => contact.companyId === companyId)
  }

  const getCompanyJobs = (companyId: string) => {
    return jobListings.filter(job => job.companyId === companyId)
  }

  const getCompanyLeads = (companyId: string) => {
    return leads.filter(lead => lead.companyId === companyId)
  }

  const getContactsByCompany = () => {
    return contacts.reduce((acc, contact) => {
      const company = companies.find(c => c.id === contact.companyId)
      if (company) {
        acc.push({ ...contact, company })
      }
      return acc
    }, [] as (Contact & { company: Company })[])
  }

  // Analytics helpers
  const getStats = () => {
    const totalCompanies = companies.length
    const totalContacts = contacts.length
    const totalJobs = jobListings.length
    const totalLeads = leads.length
    
    const leadsByStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const companiesByIndustry = companies.reduce((acc, company) => {
      const industry = company.industry || 'Unknown'
      acc[industry] = (acc[industry] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalCompanies,
      totalContacts,
      totalJobs,
      totalLeads,
      leadsByStatus,
      companiesByIndustry
    }
  }

  return {
    // Data
    companies,
    contacts,
    jobListings,
    leads,
    loading,
    
    // Company operations
    addCompany,
    updateCompany,
    deleteCompany,
    
    // Contact operations
    addContact,
    updateContact,
    deleteContact,
    
    // Job operations
    addJobListing,
    updateJobListing,
    deleteJobListing,
    
    // Lead operations
    addLead,
    updateLead,
    deleteLead,
    
    // Search operations
    saveSearchHistory,
    getSearchHistory,
    
    // Helper functions
    getCompanyContacts,
    getCompanyJobs,
    getCompanyLeads,
    getContactsByCompany,
    getStats,
    
    // Reload data
    loadAllData
  }
}