import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        There was a problem with the authentication process. Please try again or contact support if the issue persists.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/api/auth/signin">Try Again</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  )
}
