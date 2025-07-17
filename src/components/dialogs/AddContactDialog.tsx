import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import type { Contact, Company } from '@/types'

interface AddContactDialogProps {
  companies: Company[]
  onAddContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'userId'>) => void
}

export function AddContactDialog({ companies, onAddContact }: AddContactDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    title: '',
    email: '',
    linkedin: '',
    phone: '',
    department: '',
    isDecisionMaker: false,
    notes: ''
  })
  const { toast } = useToast()

  const departments = [
    'Engineering', 'Finance', 'Operations', 'Marketing', 'Sales', 
    'HR', 'Product', 'Legal', 'Executive', 'IT'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.companyId) {
      toast({
        title: "Error",
        description: "Name and company are required",
        variant: "destructive"
      })
      return
    }

    onAddContact({
      companyId: formData.companyId,
      name: formData.name.trim(),
      title: formData.title.trim(),
      email: formData.email.trim(),
      linkedin: formData.linkedin.trim(),
      phone: formData.phone.trim(),
      department: formData.department,
      isDecisionMaker: formData.isDecisionMaker,
      notes: formData.notes.trim()
    })

    toast({
      title: "Success",
      description: "Contact added successfully"
    })

    setFormData({
      companyId: '',
      name: '',
      title: '',
      email: '',
      linkedin: '',
      phone: '',
      department: '',
      isDecisionMaker: false,
      notes: ''
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="company">Company *</Label>
            <Select value={formData.companyId} onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Chief Technology Officer"
            />
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="contact@company.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="linkedin">LinkedIn Profile</Label>
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDecisionMaker"
              checked={formData.isDecisionMaker}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDecisionMaker: checked as boolean }))}
            />
            <Label htmlFor="isDecisionMaker">Decision Maker</Label>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this contact"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Contact
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}