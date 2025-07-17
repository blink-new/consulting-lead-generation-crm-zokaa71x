import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import type { Company } from '@/types'

interface AddCompanyDialogProps {
  onAddCompany: (company: Omit<Company, 'id' | 'createdAt' | 'userId'>) => void
}

export function AddCompanyDialog({ onAddCompany }: AddCompanyDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: ''
  })
  const { toast } = useToast()

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 
    'Consulting', 'Education', 'Real Estate', 'Media', 'Transportation'
  ]

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-1000 employees', '1000+ employees'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive"
      })
      return
    }

    onAddCompany({
      name: formData.name.trim(),
      industry: formData.industry,
      size: formData.size,
      location: formData.location.trim(),
      website: formData.website.trim(),
      description: formData.description.trim()
    })

    toast({
      title: "Success",
      description: "Company added successfully"
    })

    setFormData({
      name: '',
      industry: '',
      size: '',
      location: '',
      website: '',
      description: ''
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="size">Company Size</Label>
            <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {companySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://company.com"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the company"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Company
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}