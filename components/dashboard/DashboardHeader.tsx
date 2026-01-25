import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export function DashboardHeader({ user }: { user: any }) {
  const profileImageUrl = user?.profile_image
    ? `${API_URL}/storage/app/public/${user.profile_image}`
    : "/placeholder.svg"

    console.log("PROFILE IMAGE URL 👉", profileImageUrl)


  return (
    <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profileImageUrl} alt={user.name} />
          <AvatarFallback>
            {user.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Member since{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </span>
            <span>•</span>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {user.subscription_plan ?? "Free"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  )
}
