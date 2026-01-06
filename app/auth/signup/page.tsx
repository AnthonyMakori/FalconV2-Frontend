'use client'

import { AuthForm } from "@/components/auth/auth-form"

// const handleSubmit = async (formData: FormData) => {
//   'use server'

//   const email = formData.get('email') as string
//   const password = formData.get('password') as string

//   // Here you would typically call your API to handle the signup
//   //handling with
//   // For example:
//   // await api.signup({ email, password })

//   console.log('Sign up with:', { email, password })
// }

export default function SignUpPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <AuthForm type="signup" />
    </div>
  )
}
