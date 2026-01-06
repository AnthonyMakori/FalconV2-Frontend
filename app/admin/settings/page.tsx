'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
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

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your site's general settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="Falcon Eye Philmz" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  defaultValue="The premier platform for streaming African movies and series. Discover the rich storytelling traditions of the continent."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="info@falconeyephilmz.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" defaultValue="+254 123 456 789" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue="123 Cinema Street, Nairobi, Kenya" className="min-h-[80px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <select
                  id="currency"
                  className="w-full appearance-none bg-card border rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  defaultValue="KES"
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
                  defaultValue="Africa/Nairobi"
                >
                  <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                </select>
              </div>

              <div className="flex items-center justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
                  <div className="flex items-center gap-2">
                    <input type="radio" id="theme-dark" name="theme" defaultChecked />
                    <Label htmlFor="theme-dark">Dark</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="theme-light" name="theme" />
                    <Label htmlFor="theme-light">Light</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" id="theme-system" name="theme" />
                    <Label htmlFor="theme-system">System</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-5 gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-[#ff6900] cursor-pointer ring-2 ring-offset-2 ring-[#ff6900]"></div>
                    <span className="text-xs">Orange</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-[#0070f3] cursor-pointer"></div>
                    <span className="text-xs">Blue</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-[#10b981] cursor-pointer"></div>
                    <span className="text-xs">Green</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-[#8b5cf6] cursor-pointer"></div>
                    <span className="text-xs">Purple</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-[#ef4444] cursor-pointer"></div>
                    <span className="text-xs">Red</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-2xl font-bold">F</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Logo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs font-bold">F</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Favicon
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-dark-mode">Enable Dark Mode Toggle</Label>
                  <Switch id="enable-dark-mode" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Allow users to switch between light and dark mode</p>
              </div>

              <div className="flex items-center justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email settings for notifications and newsletters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input id="smtp-username" placeholder="username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input id="smtp-password" type="password" placeholder="••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" placeholder="noreply@falconeyephilmz.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" placeholder="Falcon Eye Philmz" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-welcome-email">Welcome Email</Label>
                  <Switch id="enable-welcome-email" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Send a welcome email to new users</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-purchase-email">Purchase Confirmation</Label>
                  <Switch id="enable-purchase-email" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Send a confirmation email after purchase</p>
              </div>

              <div className="flex items-center justify-end">
                <Button variant="outline" className="mr-2">
                  Test Email
                </Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mpesa-api-key">M-PESA API Key</Label>
                <div className="flex gap-2">
                  <Input id="mpesa-api-key" type="password" defaultValue="••••••••••••••••" className="flex-1" />
                  <Button variant="outline" size="sm">
                    Show
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mpesa-secret-key">M-PESA Secret Key</Label>
                <div className="flex gap-2">
                  <Input id="mpesa-secret-key" type="password" defaultValue="••••••••••••••••" className="flex-1" />
                  <Button variant="outline" size="sm">
                    Show
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flutterwave-public-key">Flutterwave Public Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="flutterwave-public-key"
                    type="password"
                    defaultValue="••••••••••••••••"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Show
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flutterwave-secret-key">Flutterwave Secret Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="flutterwave-secret-key"
                    type="password"
                    defaultValue="••••••••••••••••"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Show
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-analytics">Google Analytics ID</Label>
                <Input id="google-analytics" placeholder="UA-XXXXXXXXX-X" />
              </div>

              <div className="flex items-center justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced settings for the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Switch id="maintenance-mode" />
                </div>
                <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <Switch id="debug-mode" />
                </div>
                <p className="text-sm text-muted-foreground">Enable debug mode for development</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cache-enabled">Enable Caching</Label>
                  <Switch id="cache-enabled" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Enable caching for better performance</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                <Input id="cache-ttl" type="number" defaultValue="3600" />
              </div>

              <div className="space-y-2">
                <Label>Database Backup</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline">Backup Now</Button>
                  <Button variant="outline">Restore</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Clear Cache</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline">Clear All Cache</Button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
