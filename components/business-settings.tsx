"use client"

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Building2, Phone, Mail, Clock, MapPin, Globe, Shield } from 'lucide-react'

export interface BusinessSettings {
  // Basic Information
  companyName: string
  tagline: string
  yearEstablished: string
  yearsInBusiness: string
  
  // Contact Information
  phone: string
  email: string
  address: string
  city: string
  state: string
  zipCode: string
  serviceArea: string
  
  // Business Hours
  businessHours: string
  emergencyResponse: string
  
  // Online Presence
  website: string
  showroomAddress: string
  
  // Business Details
  specialties: string[]
  certifications: string[]
  brands: string[]
  materials: string[]
  
  // Services
  services: string[]
  uniqueCapabilities: string[]
  
  // Process
  processSteps: string[]
  installationTimeline: string
  
  // Call to Actions
  homeownerCTA: string
  contractorCTA: string
}

const DEFAULT_SETTINGS: BusinessSettings = {
  companyName: "Quartz & Granite Solutions",
  tagline: "We don't just install countertops—we deliver premium solutions",
  yearEstablished: "2003",
  yearsInBusiness: "over 20 years",
  
  phone: "(813) 226-2742",
  email: "info@quartzandgranitesolutions.com",
  address: "5434 West Crenshaw St",
  city: "Tampa",
  state: "FL",
  zipCode: "33634",
  serviceArea: "Tampa Bay area (60-mile radius)",
  
  businessHours: "Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 3:00 PM",
  emergencyResponse: "24-48 hour emergency response for repairs",
  
  website: "www.quartzandgranitesolutions.com",
  showroomAddress: "5434 West Crenshaw St, Tampa, FL 33634",
  
  specialties: [
    "Custom quartz fabrication",
    "Granite fabrication and installation",
    "Porcelain countertops",
    "Quartzite surfaces",
    "Waterfall edges",
    "Miters",
    "Integrated sinks",
    "Backlighting systems"
  ],
  
  certifications: [
    "National Kitchen & Bath Association",
    "Marble Institute of America",
    "Cambria Premier Partner"
  ],
  
  brands: [
    "Cambria",
    "Caesarstone",
    "Silestone",
    "MSI",
    "Daltile"
  ],
  
  materials: [
    "Quartz",
    "Granite",
    "Porcelain",
    "Quartzite",
    "Marble"
  ],
  
  services: [
    "Kitchen countertops",
    "Bathroom vanities",
    "Commercial installations",
    "Outdoor kitchens",
    "Fireplace surrounds",
    "Custom water jet cutting",
    "Edge profiling",
    "Sink cutouts"
  ],
  
  uniqueCapabilities: [
    "Integrated sinks with removable sloped drain boards ($2,500)",
    "Precision laser templating in 3D space",
    "Computer-aided layout design with vein matching",
    "CNC fabrication and water jet precision",
    "Spider crane capability for large installations",
    "Custom water jet inlays and monograms"
  ],
  
  processSteps: [
    "Initial consultation and vision discussion",
    "Project quote within budget parameters",
    "Guided material selection at supplier",
    "Precision laser templating in 3D space",
    "Computer-aided layout design with vein matching",
    "Final quote and customer approval",
    "Expert fabrication using CNC and water jet",
    "Professional installation (1-3 weeks from approval)"
  ],
  
  installationTimeline: "1-3 weeks from approval to completion",
  
  homeownerCTA: "Request Your Free Consultation",
  contractorCTA: "Request a Quote for Your Project"
}

interface BusinessSettingsEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: BusinessSettings
  onSave: (settings: BusinessSettings) => void
}

export function BusinessSettingsEditor({ open, onOpenChange, settings, onSave }: BusinessSettingsEditorProps) {
  const [editedSettings, setEditedSettings] = useState<BusinessSettings>(settings)
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    setEditedSettings(settings)
  }, [settings])

  const handleSave = () => {
    onSave(editedSettings)
    onOpenChange(false)
  }

  const handleReset = () => {
    setEditedSettings(DEFAULT_SETTINGS)
  }

  const updateField = (field: keyof BusinessSettings, value: string | string[]) => {
    setEditedSettings({
      ...editedSettings,
      [field]: value
    })
  }

  const updateListItem = (field: keyof BusinessSettings, index: number, value: string) => {
    const list = [...(editedSettings[field] as string[])]
    list[index] = value
    updateField(field, list)
  }

  const addListItem = (field: keyof BusinessSettings) => {
    const list = [...(editedSettings[field] as string[])]
    list.push('')
    updateField(field, list)
  }

  const removeListItem = (field: keyof BusinessSettings, index: number) => {
    const list = [...(editedSettings[field] as string[])]
    list.splice(index, 1)
    updateField(field, list)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business Information Settings
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your business information to automatically replace placeholders in generated content
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-6 mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="certifications">Credentials</TabsTrigger>
              <TabsTrigger value="cta">CTAs</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto">
              <TabsContent value="basic" className="mt-0 space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={editedSettings.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={editedSettings.tagline}
                      onChange={(e) => updateField('tagline', e.target.value)}
                      placeholder="Enter company tagline"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yearEstablished">Year Established</Label>
                      <Input
                        id="yearEstablished"
                        value={editedSettings.yearEstablished}
                        onChange={(e) => updateField('yearEstablished', e.target.value)}
                        placeholder="e.g., 2003"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="yearsInBusiness">Years in Business</Label>
                      <Input
                        id="yearsInBusiness"
                        value={editedSettings.yearsInBusiness}
                        onChange={(e) => updateField('yearsInBusiness', e.target.value)}
                        placeholder="e.g., over 20 years"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editedSettings.website}
                      onChange={(e) => updateField('website', e.target.value)}
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-0 space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={editedSettings.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="(813) 226-2742"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedSettings.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="info@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={editedSettings.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="5434 West Crenshaw St"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={editedSettings.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="Tampa"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={editedSettings.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        placeholder="FL"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={editedSettings.zipCode}
                        onChange={(e) => updateField('zipCode', e.target.value)}
                        placeholder="33634"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="serviceArea">Service Area</Label>
                    <Input
                      id="serviceArea"
                      value={editedSettings.serviceArea}
                      onChange={(e) => updateField('serviceArea', e.target.value)}
                      placeholder="Tampa Bay area (60-mile radius)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessHours">Business Hours</Label>
                    <Textarea
                      id="businessHours"
                      value={editedSettings.businessHours}
                      onChange={(e) => updateField('businessHours', e.target.value)}
                      placeholder="Monday-Friday: 8:00 AM - 5:00 PM"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="showroomAddress">Showroom Address</Label>
                    <Input
                      id="showroomAddress"
                      value={editedSettings.showroomAddress}
                      onChange={(e) => updateField('showroomAddress', e.target.value)}
                      placeholder="Full showroom address"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="mt-0 space-y-4">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Services</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem('services')}
                      >
                        Add Service
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedSettings.services.map((service, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={service}
                            onChange={(e) => updateListItem('services', index, e.target.value)}
                            placeholder="Enter service"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeListItem('services', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Unique Capabilities</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem('uniqueCapabilities')}
                      >
                        Add Capability
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedSettings.uniqueCapabilities.map((capability, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={capability}
                            onChange={(e) => updateListItem('uniqueCapabilities', index, e.target.value)}
                            placeholder="Enter unique capability"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeListItem('uniqueCapabilities', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Materials</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem('materials')}
                      >
                        Add Material
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedSettings.materials.map((material, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={material}
                            onChange={(e) => updateListItem('materials', index, e.target.value)}
                            placeholder="Enter material type"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeListItem('materials', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="process" className="mt-0 space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Process Steps</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem('processSteps')}
                      >
                        Add Step
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedSettings.processSteps.map((step, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <span className="text-sm font-medium mt-2 w-6">{index + 1}.</span>
                          <Input
                            value={step}
                            onChange={(e) => updateListItem('processSteps', index, e.target.value)}
                            placeholder="Enter process step"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeListItem('processSteps', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="installationTimeline">Installation Timeline</Label>
                    <Input
                      id="installationTimeline"
                      value={editedSettings.installationTimeline}
                      onChange={(e) => updateField('installationTimeline', e.target.value)}
                      placeholder="1-3 weeks from approval to completion"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyResponse">Emergency Response</Label>
                    <Input
                      id="emergencyResponse"
                      value={editedSettings.emergencyResponse}
                      onChange={(e) => updateField('emergencyResponse', e.target.value)}
                      placeholder="24-48 hour emergency response"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="certifications" className="mt-0 space-y-4">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Certifications</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem('certifications')}
                      >
                        Add Certification
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedSettings.certifications.map((cert, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={cert}
                            onChange={(e) => updateListItem('certifications', index, e.target.value)}
                            placeholder="Enter certification"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeListItem('certifications', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Partner Brands</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem('brands')}
                      >
                        Add Brand
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedSettings.brands.map((brand, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={brand}
                            onChange={(e) => updateListItem('brands', index, e.target.value)}
                            placeholder="Enter brand name"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeListItem('brands', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Specialties</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem('specialties')}
                      >
                        Add Specialty
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {editedSettings.specialties.map((specialty, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={specialty}
                            onChange={(e) => updateListItem('specialties', index, e.target.value)}
                            placeholder="Enter specialty"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeListItem('specialties', index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cta" className="mt-0 space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="homeownerCTA">Homeowner Call-to-Action</Label>
                    <Input
                      id="homeownerCTA"
                      value={editedSettings.homeownerCTA}
                      onChange={(e) => updateField('homeownerCTA', e.target.value)}
                      placeholder="Request Your Free Consultation"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contractorCTA">Contractor Call-to-Action</Label>
                    <Input
                      id="contractorCTA"
                      value={editedSettings.contractorCTA}
                      onChange={(e) => updateField('contractorCTA', e.target.value)}
                      placeholder="Request a Quote for Your Project"
                    />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 bg-muted/50 border-t shrink-0">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="mr-auto h-9"
          >
            Reset to Defaults
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-9"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="h-9"
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function BusinessSettingsButton({ settings, onSettingsChange }: { 
  settings: BusinessSettings
  onSettingsChange: (settings: BusinessSettings) => void 
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9"
      >
        <Building2 className="h-3 w-3 mr-1.5" />
        Business Info
      </Button>
      <BusinessSettingsEditor
        open={open}
        onOpenChange={setOpen}
        settings={settings}
        onSave={onSettingsChange}
      />
    </>
  )
}