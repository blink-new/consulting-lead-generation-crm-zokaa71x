import { useState } from 'react'
import { Search, Filter, Mail, Phone, ExternalLink, Building2, Calendar, Star, MoreHorizontal, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AddContactDialog } from '@/components/dialogs/AddContactDialog'
import { useCRMData } from '@/hooks/useCRMData'
import { useToast } from '@/hooks/use-toast'

export function Contacts() {
  const { 
    companies, 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact, 
    getContactsByCompany,
    addLead
  } = useCRMData()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterCompany, setFilterCompany] = useState<string>('all')
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [editingNotes, setEditingNotes] = useState('')
  const { toast } = useToast()

  const contactsWithCompany = getContactsByCompany()

  const roles = ['all', 'decision-makers', 'technical', 'operations', 'finance']
  const companyNames = ['all', ...Array.from(new Set(contactsWithCompany.map(c => c.company.name)))]

  const filteredContacts = contactsWithCompany.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = filterRole === 'all' || 
                       (filterRole === 'decision-makers' && contact.isDecisionMaker) ||
                       (filterRole === 'technical' && contact.department.toLowerCase().includes('engineering')) ||
                       (filterRole === 'operations' && contact.department.toLowerCase().includes('operations')) ||
                       (filterRole === 'finance' && contact.department.toLowerCase().includes('finance'))
    
    const matchesCompany = filterCompany === 'all' || contact.company.name === filterCompany
    
    return matchesSearch && matchesRole && matchesCompany
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getDaysAgo = (date: string) => {
    const days = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 3600 * 24))
    return days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`
  }

  const handleUpdateNotes = (contactId: string) => {
    updateContact(contactId, { notes: editingNotes })
    toast({
      title: "Notes Updated",
      description: "Contact notes have been saved"
    })
  }

  const handleMarkAsContacted = (contactId: string) => {
    updateContact(contactId, { 
      lastContactDate: new Date().toISOString().split('T')[0]
    })
    toast({
      title: "Contact Updated",
      description: "Marked as contacted today"
    })
  }

  const handleCreateLead = (contact: any) => {
    addLead({
      companyId: contact.companyId,
      contactId: contact.id,
      status: 'new',
      priority: contact.isDecisionMaker ? 'high' : 'medium',
      source: 'contact_database',
      notes: `Lead created from contact: ${contact.name} at ${contact.company.name}`
    })
    
    toast({
      title: "Lead Created",
      description: `New lead created for ${contact.name}`
    })
  }

  const handleDeleteContact = (contactId: string, contactName: string) => {
    deleteContact(contactId)
    toast({
      title: "Contact Deleted",
      description: `${contactName} has been removed from your contacts`
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contact Management</h2>
          <p className="text-gray-600">Manage your network of company contacts and decision makers</p>
        </div>
        <AddContactDialog companies={companies} onAddContact={addContact} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold">{contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Decision Makers</p>
                <p className="text-2xl font-bold">{contacts.filter(c => c.isDecisionMaker).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Contacts</p>
                <p className="text-2xl font-bold">
                  {contacts.filter(c => c.lastContactDate && new Date(c.lastContactDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold">{new Set(contacts.map(c => c.companyId)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search contacts, titles, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="decision-makers">Decision Makers</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCompany} onValueChange={setFilterCompany}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                {companyNames.map((company) => (
                  <SelectItem key={company} value={company} className="capitalize">
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Dialog key={contact.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold truncate">{contact.name}</h3>
                        {contact.isDecisionMaker && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{contact.title}</p>
                      <p className="text-sm text-gray-500">{contact.company.name}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {contact.email && (
                        <DropdownMenuItem asChild>
                          <a href={`mailto:${contact.email}`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleMarkAsContacted(contact.id)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCreateLead(contact)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Create Lead
                      </DropdownMenuItem>
                      {contact.linkedin && (
                        <DropdownMenuItem asChild>
                          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View LinkedIn
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteContact(contact.id, contact.name)}
                      >
                        Delete Contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Department</span>
                    <Badge variant="outline">{contact.department}</Badge>
                  </div>
                  {contact.lastContactDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Contact</span>
                      <span className="text-gray-500">{getDaysAgo(contact.lastContactDate)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    {contact.email && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${contact.email}`}>
                          <Mail className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    {contact.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${contact.phone}`}>
                          <Phone className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    {contact.linkedin && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedContact(contact)
                        setEditingNotes(contact.notes || '')
                      }}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                </div>
              </CardContent>
            </Card>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{contact.name}</span>
                      {contact.isDecisionMaker && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-normal">{contact.title}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="details" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Company</Label>
                      <p className="text-sm text-gray-600">{contact.company.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Department</Label>
                      <p className="text-sm text-gray-600">{contact.department}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Industry</Label>
                      <p className="text-sm text-gray-600">{contact.company.industry}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Company Size</Label>
                      <p className="text-sm text-gray-600">{contact.company.size}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm text-gray-600">{contact.company.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Role Type</Label>
                      <Badge variant={contact.isDecisionMaker ? "default" : "secondary"}>
                        {contact.isDecisionMaker ? "Decision Maker" : "Influencer"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Contact Information</Label>
                    <div className="space-y-2">
                      {contact.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <a href={`tel:${contact.phone}`} className="text-sm text-blue-600 hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {contact.linkedin && (
                        <div className="flex items-center space-x-2">
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button onClick={() => handleCreateLead(contact)} className="w-full">
                      Create Sales Lead
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleMarkAsContacted(contact.id)} 
                      className="w-full"
                    >
                      Mark as Contacted Today
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  <div className="space-y-3">
                    {contact.lastContactDate && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Last Contact</p>
                          <p className="text-xs text-gray-500">{new Date(contact.lastContactDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Contact Added</p>
                        <p className="text-xs text-gray-500">{new Date(contact.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={() => handleMarkAsContacted(contact.id)} className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Log Contact Today
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <Textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Add notes about this contact..."
                      className="mt-2"
                      rows={6}
                    />
                  </div>
                  <Button onClick={() => handleUpdateNotes(contact.id)}>
                    Save Notes
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add new contacts to your database.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}