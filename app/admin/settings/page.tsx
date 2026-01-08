'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

type Settings = Record<string, any>

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Fetch settings from Laravel API
  const fetchSettings = async () => {
    if (!token) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setSettings(data)
    setLoading(false)
  }

  // Save settings to Laravel API
  const saveSettings = async (updatedSettings: Settings) => {
    if (!token) return
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSettings),
    })
    const data = await res.json()
    alert(data.message)
    fetchSettings() // refresh
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  if (loading) return <p>Loading settings...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* ------------------ GENERAL ------------------ */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your site's general settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue={settings.site_name || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  defaultValue={settings.site_description || ""}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue={settings.contact_email || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" defaultValue={settings.contact_phone || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue={settings.address || ""} className="min-h-[80px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <select
                  id="currency"
                  className="w-full appearance-none bg-card border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={settings.currency || "KES"}
                >
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full appearance-none bg-card border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue={settings.timezone || "Africa/Nairobi"}
                >
                  <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                </select>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  onClick={() =>
                    saveSettings({
                      site_name: (document.getElementById('site-name') as HTMLInputElement).value,
                      site_description: (document.getElementById('site-description') as HTMLTextAreaElement).value,
                      contact_email: (document.getElementById('contact-email') as HTMLInputElement).value,
                      contact_phone: (document.getElementById('contact-phone') as HTMLInputElement).value,
                      address: (document.getElementById('address') as HTMLTextAreaElement).value,
                      currency: (document.getElementById('currency') as HTMLSelectElement).value,
                      timezone: (document.getElementById('timezone') as HTMLSelectElement).value,
                    })
                  }
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------ APPEARANCE ------------------ */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Theme</Label>
                <div className="flex items-center gap-4">
                  {["dark","light","system"].map(theme => (
                    <div key={theme} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`theme-${theme}`}
                        name="theme"
                        value={theme}
                        defaultChecked={settings.default_theme === theme}
                      />
                      <Label htmlFor={`theme-${theme}`}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    {color: "#ff6900", name: "Orange"},
                    {color: "#0070f3", name: "Blue"},
                    {color: "#10b981", name: "Green"},
                    {color: "#8b5cf6", name: "Purple"},
                    {color: "#ef4444", name: "Red"},
                  ].map(({color,name}) => (
                    <div key={color} className="flex flex-col items-center gap-1">
                      <div
                        className={`h-8 w-8 rounded-full cursor-pointer ${settings.primary_color === color ? "ring-2 ring-offset-2 ring-[#ff6900]" : ""}`}
                        style={{backgroundColor: color}}
                      ></div>
                      <span className="text-xs">{name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-dark-mode">Enable Dark Mode Toggle</Label>
                  <Switch id="enable-dark-mode" defaultChecked={settings.enable_dark_mode === "1"} />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button
                  onClick={() =>
                    saveSettings({
                      default_theme: (document.querySelector<HTMLInputElement>('input[name="theme"]:checked')!)?.value,
                      primary_color: settings.primary_color,
                      enable_dark_mode: (document.getElementById('enable-dark-mode') as HTMLInputElement).checked ? "1" : "0",
                    })
                  }
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------ EMAIL ------------------ */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email settings for notifications and newsletters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {id:"smtp-host",label:"SMTP Host"},
                {id:"smtp-port",label:"SMTP Port"},
                {id:"smtp-username",label:"SMTP Username"},
                {id:"smtp-password",label:"SMTP Password",type:"password"},
                {id:"from-email",label:"From Email"},
                {id:"from-name",label:"From Name"},
              ].map(({id,label,type}) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input id={id} type={type || "text"} defaultValue={settings[id] || ""} />
                </div>
              ))}

              {[
                {id:"enable-welcome-email",label:"Welcome Email"},
                {id:"enable-purchase-email",label:"Purchase Confirmation"}
              ].map(({id,label}) => (
                <div key={id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={id}>{label}</Label>
                    <Switch id={id} defaultChecked={settings[id] === "1"} />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-end">
                <Button
                  onClick={() =>
                    saveSettings({
                      smtp_host: (document.getElementById('smtp-host') as HTMLInputElement).value,
                      smtp_port: (document.getElementById('smtp-port') as HTMLInputElement).value,
                      smtp_username: (document.getElementById('smtp-username') as HTMLInputElement).value,
                      smtp_password: (document.getElementById('smtp-password') as HTMLInputElement).value,
                      from_email: (document.getElementById('from-email') as HTMLInputElement).value,
                      from_name: (document.getElementById('from-name') as HTMLInputElement).value,
                      enable_welcome_email: (document.getElementById('enable-welcome-email') as HTMLInputElement).checked ? "1" : "0",
                      enable_purchase_email: (document.getElementById('enable-purchase-email') as HTMLInputElement).checked ? "1" : "0",
                    })
                  }
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------ API KEYS ------------------ */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {id:"mpesa-api-key",label:"M-PESA API Key"},
                {id:"mpesa-secret-key",label:"M-PESA Secret Key"},
                {id:"flutterwave-public-key",label:"Flutterwave Public Key"},
                {id:"flutterwave-secret-key",label:"Flutterwave Secret Key"},
                {id:"google-analytics",label:"Google Analytics ID"}
              ].map(({id,label}) => (
                <div key={id} className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input id={id} type="password" defaultValue={settings[id] || ""} />
                </div>
              ))}

              <div className="flex items-center justify-end">
                <Button
                  onClick={() =>
                    saveSettings({
                      "mpesa-api-key": (document.getElementById('mpesa-api-key') as HTMLInputElement).value,
                      "mpesa-secret-key": (document.getElementById('mpesa-secret-key') as HTMLInputElement).value,
                      "flutterwave-public-key": (document.getElementById('flutterwave-public-key') as HTMLInputElement).value,
                      "flutterwave-secret-key": (document.getElementById('flutterwave-secret-key') as HTMLInputElement).value,
                      "google-analytics": (document.getElementById('google-analytics') as HTMLInputElement).value,
                    })
                  }
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------ ADVANCED ------------------ */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced settings for the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {id:"maintenance-mode",label:"Maintenance Mode"},
                {id:"debug-mode",label:"Debug Mode"},
                {id:"cache-enabled",label:"Enable Caching"}
              ].map(({id,label}) => (
                <div key={id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={id}>{label}</Label>
                    <Switch id={id} defaultChecked={settings[id] === "1"} />
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                <Input id="cache-ttl" type="number" defaultValue={settings.cache_ttl || "3600"} />
              </div>

              <div className="flex items-center justify-end">
                <Button
                  onClick={() =>
                    saveSettings({
                      "maintenance-mode": (document.getElementById('maintenance-mode') as HTMLInputElement).checked ? "1" : "0",
                      "debug-mode": (document.getElementById('debug-mode') as HTMLInputElement).checked ? "1" : "0",
                      "cache-enabled": (document.getElementById('cache-enabled') as HTMLInputElement).checked ? "1" : "0",
                      cache_ttl: (document.getElementById('cache-ttl') as HTMLInputElement).value,
                    })
                  }
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
